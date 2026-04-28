// Learn localStorage and JSON files
const accepter = document.getElementById("Accept")
const rejecter = document.getElementById("Reject")
const beginner = document.getElementById("beginStory")
const dialoguer = document.getElementById("dialogueBox")
const namer = document.getElementById("names")
const labeler = document.getElementById("cmdLabel")
const inputter = document.getElementById("cmdInput")







const person = {
    name: "James Fisher Brandon",
    age: 30,
    ssn: 39603927,
    address: {
        city: "New York",
        zip: "10001"
    }
}
const person2 = {
    name: "Ryan McCool Schutte",
    age: 30,
    ssn: 39603927,
    address: {
        city: "New York",
        zip: "10001"
    }
}











beginner.hidden = true

function acceptPerson(){
    accepter.hidden = true
    rejecter.hidden = true
    dialoguer.innerHTML = "You accept the offer, hurryingly grabbing your coat and the keys to your <br> Lada and driving to the bus stop with your ticket to Yakutsk. <br> After about a week-long trip nearly 5000 miles long, you arrive.";
    beginner.hidden = false
}
function rejectPerson(){}

function startGame(){
    beginner.hidden = true
    dialoguer.innerHTML = person.name + " arrives at the window..."
    

}

function cmdExecute(){}
