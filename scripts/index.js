"use strict";

const mainCanvasElement = document.querySelector("#maincanvas");
const rolesMenuCanvasElement = document.querySelector("#rolesmenucanvas");
const namesMenuCanvasElement = document.querySelector("#namesmenucanvas");


// Call functions to perform the initial paint of the webpage
displayAllMembersAndNamesMenu(mainCanvasElement, namesMenuCanvasElement);
displayRolesSelectMenu(rolesMenuCanvasElement);


// This function is designed to be triggered by an event listener set on the job roles selection form. It evaluates the job roles selected by the user on the form, and then repaints the webpage with the info cards of the team members with those roles.
// @param event - the event object of the event that triggered the listener.
function rolesFormHandler(event) {
    
    event.preventDefault();

    const checkboxList = document.getElementsByName("selectedroles");
    let rolesIdArray = [];
    
    //Loop over the checkbox values to see which ones were checked by the user and store the checkbox values in an array
    checkboxList.forEach((checkboxElement) => {
        if (checkboxElement.checked === true) {
            rolesIdArray.push(checkboxElement.value);
        }
    });
    
    //Fetch the employees by role only if the user has actually made checkbox selections
    if (rolesIdArray.length > 0) {
        displayMembersByRoles(mainCanvasElement, rolesIdArray);    
    };

}


// This function is designed to be triggered by an event listener set on the team member names form. It evaluates the team member that is selected by the user on the form, and then repaints the webpage with the info card of the team member that was selected.
// @param event - the event object of the event that triggered the listener.
function namesFormHandler(event) {
    
    event.preventDefault();

    const dropdownSelection = document.getElementById("employeenames");
    const selectedEmployeeId = dropdownSelection.value;
    
    displayOneMemberById(mainCanvasElement, selectedEmployeeId);

}


// This function is designed to be triggered by an event listener set on a button. Whenever the listener is triggered, this function will repaint the webpage with the info cards of all team members, effectivly resetting the page to the initial state.
// @param event - the event object of the event that triggered the listener.
function resetMainCanvas(event) {

    event.preventDefault();
    displayAllMembers(mainCanvasElement);

}
