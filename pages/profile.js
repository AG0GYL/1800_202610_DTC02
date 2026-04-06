import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../src/firebaseConfig.js";
import {
  doc,
  documentId,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  collectionGroup,
  where,
} from "firebase/firestore";

//------------------------------------------------------------
// This function is an Event Listener for the file (image) picker
// When an image is chosen, it will then save that image into the
// user's document in Firestore
//-------------------------------------------------------------

function uploadImage() {
  // Attach event listener to the file input
  // Function to handle file selection and Base64 encoding
  document
    .getElementById("inputImage")
    .addEventListener("change", handleFileSelect);
  function handleFileSelect(event) {
    var file = event.target.files[0]; // Get the selected file
    console.log("1. file selected:", file); // is this logging?

    if (file) {
      var reader = new FileReader(); // Create a FileReader to read the file

      // When file reading is complete
      reader.onload = function (e) {
        var base64String = e.target.result.split(",")[1]; // Extract Base64 data
        console.log("2. base64 ready, length:", base64String.length); // is this logging?

        // Save the Base64 string to Firestore under the user's profile
        saveProfileImage(base64String);
      };

      // Read the file as a Data URL (Base64 encoding)
      reader.readAsDataURL(file);
    }
  }
}
uploadImage();

//---------------------------------------------------
// Function to save the Base64 image to Firestore
// as a key value pair in the user's document.
// This function is triggered when a image is selected.
//---------------------------------------------------
async function saveProfileImage(base64String) {
  // Wait for the currently signed-in user
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userId = user.uid;
      const userDocRef = doc(db, "users", userId);

      try {
        // Use setDoc with merge:true to avoid overwriting other fields
        await setDoc(
          userDocRef,
          { profileImage: base64String },
          { merge: true },
        );

        console.log("✅ Profile image saved successfully!");
        displayProfileImage(base64String); // Show the image in the UI
      } catch (error) {
        console.error("❌ Error saving profile image:", error);
      }
    } else {
      console.error("⚠️ No user is signed in.");
    }
  });
}

//----------------------------------------------------------------
// Function to display the stored Base64 image on the profile page.
// This is called when the user picks an image using the file chooser.
// so that the user can see what picture they picked!
// Before the image can be displayed, prepend meta data info back.
//----------------------------------------------------------------
function displayProfileImage(base64String) {
  const imgElement = document.getElementById("profileImage"); // Assuming there's an <img> element with this ID
  if (imgElement) {
    imgElement.src = `data:image/png;base64,${base64String}`; // Set the image source to the Base64 string
  } else {
    console.error("⚠️ No image element found to display the profile image.");
  }
}

//-----------------------------------------------------------
// This is a default function that runs onload to populate
// the profile page form with whatever data exists for that user
// including the image that was previously chosen.
//-----------------------------------------------------------
function populateUserInfo() {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        // reference to the user document
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          // Extract user info fields from document data
          // and provide default empty strings if fields are missing
          // Assumes knowledge of property names in the user document
          const userData = userSnap.data();
          const {
            name = "",
            school = "",
            city = "",
            profileImage = "",
          } = userData;

          // Populate form fields with user data
          document.getElementById("nameInput").value = name;
          document.getElementById("schoolInput").value = school;
          document.getElementById("cityInput").value = city;

          // Populate user current information
          document.getElementById("currentName").innerText = name;
          document.getElementById("currentSchool").innerText = school;
          //---------------------------------------------
          //Add metadata back, and assign to image source
          //---------------------------------------------
          //var userImage = userDoc.data().profileImage;
          // only change when there is an existing profileImage in Firestore, else use elmo!
          if (profileImage) {
            document.getElementById("profileImage").src =
              "data:image/png;base64," + profileImage;
          }
          // Populate reviews posted section
          populateReviews(user.uid, name, profileImage);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error getting user document:", error);
      }
    } else {
      console.log("No user is signed in");
    }
  });
}

//call the function to run it
populateUserInfo();

// WORKING ON PROFILE AVATAR SUBMISSION

// Function to enable editing of user info form fields
document.querySelector("#editButton").addEventListener("click", editUserInfo);
function editUserInfo() {
  const fieldset = document.getElementById("personalInfoFields");
  const saveBtn = document.getElementById("saveButton");

  // Toggle fieldset
  fieldset.disabled = !fieldset.disabled;
  // Toggle save button
  saveBtn.disabled = fieldset.disabled;
}

// Function save updated user info from the profile form
//Add event listener for save button
document.querySelector("#saveButton").addEventListener("click", saveUserInfo);
async function saveUserInfo() {
  // get currently logged-in user
  const user = auth.currentUser;
  if (!user) {
    alert("No user is signed in. Please log in first.");
    return;
  }

  // get user entered values
  const userName = document.getElementById("nameInput").value;
  const userSchool = document.getElementById("schoolInput").value;
  const userCity = document.getElementById("cityInput").value;

  // update user's document in Firestore
  await updateUserDocument(user.uid, userName, userSchool, userCity);

  // disable edit AFTER submisison
  document.getElementById("personalInfoFields").disabled = true;

  // disable save button after clicking save
  // Toggle save button
  const saveBtn = document.getElementById("saveButton");
  const fieldset = document.getElementById("personalInfoFields");

  saveBtn.disabled = fieldset.disabled;
}

// Updates the user document in Firestore with new values
// Parameters:
//   uid (string)  – user’s UID
//   name, school, city (strings)
async function updateUserDocument(uid, name, school, city) {
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, { name, school, city });
    console.log("User document successfully updated!");
    // Update user current information
    document.getElementById("currentName").innerText = name;
    document.getElementById("currentSchool").innerText = school;
  } catch (error) {
    console.error("Error updating user document:", error);
  }
}

async function populateReviews(userID, username, profileImage) {
  try {
    const myReviewRef = query(
      collectionGroup(db, "reviews"),
      where("userID", "==", userID),
    );

    const myReviewSnap = await getDocs(myReviewRef);

    myReviewSnap.forEach(async (doc) => {
      let data = doc.data();
      // Fetch venueID
      // doc.ref = review itself
      // doc.ref.parent = review collection
      // doc.ref.parent.parent = venue
      const venueID = doc.ref.parent.parent.id;
      // fetch venue name
      const venueRef = doc.ref.parent.parent;
      const venueSnap = await getDoc(venueRef);
      const venueName = venueSnap.data().name;

      // REVIEWER DETAILS
      const reviewUserName = username || "Anonymous";

      // REVIEW DETAILS
      const venueTitle = data.title || "(No title)";
      const venueAtmosphere = data.atmosphere || "(Not specified)";
      const venueGroupSize = data.groupSize || "(Not specified)";
      const venueDescription = data.description || "";
      const venuePricing = data.pricing ?? "(unknown)";
      const venueWouldVisitAgain = data.wouldVisitAgain ?? "(unknown)";
      const venueRating = Number(data.rating ?? 0);

      // Format the time
      let time = "";
      if (data.timestamp?.toDate) {
        time = data.timestamp.toDate().toLocaleString();
      }

      // Clone the template and fill in the fields
      const reviewCard = reviewCardTemplate.content.cloneNode(true);

      // REVIEWER DETAILS
      reviewCard.querySelector(".reviewUserName").textContent = reviewUserName;
      reviewCard.querySelector(".reviewUserAvatar").src =
        `data:image/png;base64,${profileImage}`;

      // REVIEW DETAILS
      reviewCard.querySelector(".reviewUserTimeStamp").textContent = time;
      reviewCard.querySelector(".reviewUserTitle").textContent = venueTitle;
      reviewCard.querySelector(".reviewUserAtmosphere").textContent =
        venueAtmosphere;
      reviewCard.querySelector(".reviewUserGroupSize").textContent =
        venueGroupSize;
      reviewCard.querySelector(".reviewUserDescription").textContent =
        venueDescription;
      reviewCard.querySelector(".reviewUserPricing").textContent = venuePricing;
      reviewCard.querySelector(".reviewUserWouldVisitAgain").textContent =
        venueWouldVisitAgain;
      // CLICKING ON REVIEW REDIRECTS TO VENUE PAGE
      reviewCard.querySelector(".reviewVenueLink").href =
        `/pages/venue.html?docID=${venueID}`;
      reviewCard.querySelector(".reviewVenueLink").innerText = venueName;

      // Star rating
      let starRating = "";
      const safeRating = Math.max(0, Math.min(5, venueRating));
      for (let i = 0; i < safeRating; i++) {
        starRating +=
          '<span class="material-icons starIcon text-orange-400 text-3xl cursor-pointer">star</span>';
      }
      for (let i = safeRating; i < 5; i++) {
        starRating +=
          '<span class="material-icons starIcon text-orange-400 text-3xl cursor-pointer">star_outline</span>';
      }
      reviewCard.querySelector(".reviewUseRating").innerHTML = starRating;

      venueReviewsGoesHere.appendChild(reviewCard);
    });
  } catch (error) {
    console.log(error);
  }
}

// populateReviews();
