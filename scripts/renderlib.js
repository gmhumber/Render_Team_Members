"use strict";

// This function is used to generate the HTML code for an info card of a team member. This function is designed to be a foundational piece to be called by other functions in the program.
// @param teamMemberObject - a JSON object containing the information of one team member
// @returns - HTML code for a team member information card 
function generateCard(teamMemberObject) {
    
    if (typeof teamMemberObject !== 'object') {
        console.log("Error: generateCard() function expects an object");
        return;
    }

    const employeeId = teamMemberObject.employeeid;
    const employeeName = `${teamMemberObject.employeefname} ${teamMemberObject.employeelname}`;
    const employeeBio = teamMemberObject.employeebio.length > 0 ? teamMemberObject.employeebio : "No bio available";
    const employeeRoles = teamMemberObject.roles;

    let card = `<div class="carddiv" id="carddiv_${employeeId}">`;

    // Add a crown to the employee's card if they are featured
    if (teamMemberObject.employeeisfeatured === "1") {
        card += `<div class="crowndiv" id="crowndiv_${employeeId}"><p>&#128081</p></div>`;
        card += `<div class="sr_crowndiv" id="sr_crowndiv_${employeeId}"><p>${employeeName} is a featured employee</p></div>`;
    } else {
        card += `<div class="crowndiv"></div>`;
    }

    // Insert employee pic if there is one, otherwise use the standard no-image placeholder
    if (teamMemberObject.employeehaspic === "1") {
        card += `<div class="picdiv" id="picdiv_${employeeId}"><img src="http://sandbox.bittsdevelopment.com/code1/employeepics/${employeeId}.jpg" alt="image of ${employeeName}" /></div>`;
    } else {
        card += `<div class="picdiv" id="picdiv_${employeeId}"><img src="images/noimage.svg" alt="image unavailable" /></div>`;
    };

    card += `<div class="namediv" id="namediv_${employeeId}"><p>${employeeName}</p></div>`;
    
    card += `<div class="biodiv" id="biodiv_${employeeId}"><p>${employeeBio}</p></div>`;

    card += `<div class="rolesdiv" id="rolesdiv_${employeeId}">`;

    // This loop interates over all of the employee roles and outputs the HTML/CSS code for each role
    for (let i = 0; i < employeeRoles.length; i++) {
        card += `<div class="rolediv" style="color:white; background-color:${employeeRoles[i].rolecolor}"><p>${employeeRoles[i].rolename}</p></div>`;
    };

    card += `</div>`;

    card += `</div>`;

    return card;
}


// This function is designed to be used for the initial paint of the webpage on first load up. It generates the HTML code for the info cards of all team members and the form which allows users to find and select one particular team member for display. This function was created to do both tasks simultaneously because it is more efficient this way - when generating all of the HTML elements, only a single fetch() call is needed to obtain the necessary data and a single loop is used to iterate over that data while producing all of the HTML code. However, this efficiency comes at the expense of slightly less readable code.
// @param mainCanvasContainer - the DOM container element into which the HTML code for all the team member info cards will be inserted.
// @param namesCanvasContainer - the DOM container element into which the HTML code for the team member name selection form will be inserted.
function displayAllMembersAndNamesMenu(mainCanvasContainer, namesCanvasContainer) {

    fetch('http://sandbox.bittsdevelopment.com/code1/fetchemployees.php')
        .then((response) => {
            return response.json();
        })
        .then((allMembersObject) => {

            let cards = "";

            let namesMenu = `<form action="#" method="GET">
                                <fieldset>
                                    <legend>Find Team Member By Name</legend>
                                    <div>
                                        <label for="employeenames">Select an employee:</label>
                                    </div>
                                    <div>
                                        <select name="employeename" id="employeenames">`;
            
            // Iterate over each employee member to extract the employee id and name info for use to construct the employee selection drop down list
            Object.entries(allMembersObject).forEach(([key, value]) => {
                const card = generateCard(value);
                
                cards += card;

                namesMenu += `<option value="${value.employeeid}">${value.employeefname} ${value.employeelname}</option>`;

            });

            namesMenu += `</select>
                        </div>
                        <button type="submit" onclick="namesFormHandler(event);">Select Member</button>
                    </fieldset>
                </form>`;
        
            mainCanvasContainer.innerHTML = cards;
            namesCanvasContainer.innerHTML = namesMenu;

        })
        .catch((err) => {
            console.log(err)
        });

}


// This function generates the HTML code for the info cards of all team members and paints them to the webpage. It was designed for refreshing the webpage on subsequent repaints.
// @param container - the DOM container element into which the HTML code for all the team member info cards will be inserted.
function displayAllMembers(container) {

    fetch('http://sandbox.bittsdevelopment.com/code1/fetchemployees.php')
        .then((response) => {
            return response.json();
        })
        .then((allMembersObject) => {

            let cards = "";
        
            // Iterate over all employees and construct the HTML code for each person's card by using the generateCard() function
            Object.entries(allMembersObject).forEach(([key, value]) => {
                const card = generateCard(value);
                cards += card;
            });
        
            container.innerHTML = cards;

        })
        .catch((err) => {
            console.log(err)
        });

}


// This function generates the HTML code for the info card of a single team member identified by their Employee ID and inserts it into the webpage.
// @param container - the DOM container element into which the HTML code for the selected team member's info card will be inserted.
 // @param id - Employee Id of the selected team member.
function displayOneMemberById(container, id) {

    fetch('http://sandbox.bittsdevelopment.com/code1/fetchemployees.php')
        .then((response) => {
            return response.json();
        })
        .then((allMembersObject) => {

            let card = "";

            // Iterate over the employees' data to find the selected person by id, then generate the HTML card for that person 
            Object.entries(allMembersObject).forEach(([key, value]) => {
                if (value.employeeid === id) {
                    card = generateCard(value);                    
                }
            });
        
            container.innerHTML = card;

        })
        .catch((err) => {
            console.log(err)
        });

}


// This function generates the HTML code for the info cards of all of the team members with the selected role and inserts it into the webpage.
// @param container - the DOM container element into which the HTML code for the selected team members' info cards will be inserted.
 // @param rolesIdArray - a string array of all of the role Ids selected by the user.
function displayMembersByRoles(container, rolesIdArray) {

    const queryParam = rolesIdArray.join(",");

    fetch(`http://sandbox.bittsdevelopment.com/code1/fetchemployees.php?roles=${queryParam}`)
        .then((response) => {
            return response.json();
        })
        .then((responseMembersObject) => {

            let cards = "";
        
            //Iternate over the returned employees data and generate the HTML code for a card for each person
            Object.entries(responseMembersObject).forEach(([key, value]) => {
                const card = generateCard(value);
                cards += card;
            });
        
            container.innerHTML = cards;

        })
        .catch((err) => {
            console.log(err)
        });

}

// This function fetches all of the available roles from the server and then generates the HTML code to create a team member roles selection form and inserts it into the webpage.
// @param container - the DOM container element into which the HTML code of the roles selction form will be inserted.
function displayRolesSelectMenu(container) {

    fetch('http://sandbox.bittsdevelopment.com/code1/fetchroles.php')
        .then((response) => {
            return response.json();
        })
        .then((rolesArray) => {

            let rolesMenu = `<form action="#" method="GET">
                                <fieldset>
                                    <legend>Find Team Members By Roles</legend>`;
            
            // Loop over the array of roles and extract the role id and role name to constuct the checkbox menu
            rolesArray.forEach((roleObject) => {
                rolesMenu += `<div>
                                <input type="checkbox" id="roleid_${roleObject.roleid}" name="selectedroles" value="${roleObject.roleid}">
                                <label for="roleid_${roleObject.roleid}">${roleObject.rolename}</label>
                            </div>`
            });

            rolesMenu += `<button type="submit" onclick="rolesFormHandler(event);">Select Roles</button>
                </fieldset>
            </form>`;

            container.innerHTML = rolesMenu;

        })
        .catch((err) => {
            console.log(err)
        });

}


// This function fetches all of the team memebers data from the server and then generates an HTML card for every member that is featured.
// @param container - the DOM container element into which the HTML code of the cards will be injected.
function displayFeaturedMembers(container) {

    fetch('http://sandbox.bittsdevelopment.com/code1/fetchemployees.php')
        .then((response) => {
            return response.json();
        })
        .then((allMembersObject) => {

            let card = "";

            // Iterate over the employees' data to find featured employees, then generate the HTML card for that person 
            Object.entries(allMembersObject).forEach(([key, value]) => {
                if (value.employeeisfeatured === "1") {
                    card = generateCard(value);                    
                }
            });
        
            container.innerHTML = card;

        })
        .catch((err) => {
            console.log(err)
        });
};