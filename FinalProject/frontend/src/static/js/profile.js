import api from './API_Client_Mock.js';

let saveBtn = document.querySelector("#saveBtn");

// Stats stuff
let height = document.querySelector("#height");
let weight = document.querySelector("#weight");
let calories = document.querySelector("#calories");
let protein = document.querySelector("#protein");
let fat = document.querySelector("#fat");
let carbs = document.querySelector("#carbs");

saveBtn.addEventListener("click", () => {
  if (api.getUserStats(localStorage.getItem("userId")).then(stats => {
    console.log(stats);
    if (stats.length == 0) {

    }
  }));
});

//TODO Change to current user session
api.getCurrentUser().then(user => {
  localStorage.setItem("userId", user.user_id);
  let name = document.querySelector("#full-name");
  name.innerHTML = user.first_name + " " + user.last_name;
});

api.getUserStats(localStorage.getItem("userId")).then(stats => {
  console.log(stats);
  console.log(stats.length);
  if (stats.length == 0) {
    saveBtn.addEventListener("click", () => {

      api.createUserStats(localStorage.getItem("userId"), height.value, weight.value, calories.value, protein.value, carbs.value, fat.value)
        .then(response => response.text()) // First, get the response as text
        .then(text => {
          if (!text) {
            throw new Error('Received empty response body.');
          } else {
            const data = JSON.parse(text);
            console.log("Stats creates successfully: ", data);
            location.reload();
          }

        })
        .catch(err => {
          console.log("Something went wrong: ", err);
          if (error.message === "Failed to fetch") {
            alertModal();
          }
        });


    });
  }
  else {
    height.value = stats[0].height;
    weight.value = stats[0].weight;
    calories.value = stats[0].cal_goal;
    protein.value = stats[0].protein_goal;
    fat.value = stats[0].fat_goal;
    carbs.value = stats[0].carb_goal;
    console.log(stats[0].height);

    saveBtn.addEventListener("click", () => {
      api.updateUserStats(localStorage.getItem("userId"), height.value, weight.value, calories.value, protein.value, carbs.value, fat.value).then(response => {
        console.log('Stats updated successfully:', response);
        location.reload();
      })
        .catch(err => {
          console.log("something went wrong" + err);
          if (err.message === "Failed to fetch") {
            alertModal();
          }
        });
    });
  }
});

// Modal pop-up function
function alertModal() {
  let modal = new bootstrap.Modal('#offlineModal', {
    keyboard: false
  });
  modal.show();
}
