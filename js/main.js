const APIurl = "https://randomuser.me/api/?results=12";
const $grid = $('.grid-container');
const $input = $('.search');

function mapData(data) {
    const completeData = data.map((employee => {
        const fName = employee.name.first;
        const lName = employee.name.last;
        const birth = employee.dob.date;
        const email = employee.email;
        const phone = employee.phone; 
        const image = employee.picture.large;
        const country = employee.location.country;
        const state = employee.location.state;
        const locationCity = employee.location.city;
        const locationNumber = employee.location.street.number;
        const locationStreet = employee.location.street.name;
        const locationZip = employee.location.postcode;

        const setData = {
            name: `${fName} ${lName}`,
            email,
            locationCity,
            image,
            phone,
            birthday:`${birth.substring(5,7)}/${birth.substring(8,10)}/${birth.substring(2,4)}`,
            address: `${locationNumber} ${locationStreet} ${state} ${locationZip} ${country}`,
        };
        return setData;
    }));
    return completeData;
}

async function getEmployees(url) {
    const getEmployees = await fetch(url);
    const toJson = await getEmployees.json();
    const employeeData = toJson.results.map(data =>{
        const employee = data;
        return employee;
    });
    return employeeData;
}

function generateHTML(data) {
    const HTML = data.map(employee => {
        $grid.html("");
        const employeeContainter = document.createElement("section");
        employeeContainter.addClass("grid-item");
        $grid.append(employeeContainter);
        employeeContainter.html(`
         <div class="employee-card">
            <img src="${employee.image}" alt="profile picture of ${employee.name}" class="profile-image">
            <div>
              <h2 class="employee-name">${employee.name}</h2>
              <p class="employee-email">${employee.email}</p>
              <p class="locationCity">${employee.locationCity}</p>
            </div>
         </div>
           <div class="overlay">
             <p class="previous-item"><</p>
             <div class="overlay-card">
               <p class="close">X</p>
               <div>
                 <img src="${employee.image}" alt="profile picture of ${employee.name}" class="profile-image"">
                 <h2 class="employee-name-overlay">${employee.name}</h2>
                 <p class="employee-email">${employee.email}</p>
                 <p class="locationCity">${employee.locationCity}</p>
                 <hr class="overlay-hr">
                 <p class="employee-phone">${employee.phone}</p>
                 <p class="employee-address">${employee.address}</p>
                 <p class="employee-birthday">BirthDay:${employee.birthday}</p>
               </div>
             </div>
             <p class="next-item">></p>
           </div>
        `);
        return employeeContainter;
    });
    return HTML;
}

getEmployees(APIurl)
 .then(mapData)
 .then(data => {
    generateHTML(data);
    
    const target = e.target;
    const targetParent = target.parentNode;
    const targetSection = targetParent.parentNode;
    const previousSection = targetSection.previousElementSibling;
    const previousOverlay = previousSection.children[1];
    const nextSection = targetSection.nextElementSibling;
    const nextOverlay = nextSection.children[1];

    $input.keyup(function(e) {
        const currentValue = $input.value.toLowerCase();
        if (currentValue !== ""){
          let searched = [];
          for (let i = 0; i < data.length; i ++){
            if (data[i].name.toLowerCase().indexOf(currentValue) > -1){
               searched.push(data[i]);
            }
         } generateHTML(searched);

        } else {
          generateHTML(data);
        }
      });
    
      $('.close').click(function() {
          $('.overlay').hide();
      });

      $('.employee-card').click(function(e) {
          e.target.nextElementSibling.show("fade");
      });
      
      $('.next-item').click(function(e) {
         targetParent.hide();
         nextOverlay.show();
      });

      $('.previous-item').click(function(e) {
        targetParent.hide();
        previousOverlay.show();
     });
        
})
.catch(err => console.log("an error occurred",err));