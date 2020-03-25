
const validateNames = input => {
    const regex = /^[A-Za-z ]+$/;
    if(!regex.test(input)){
        console.log("\nPlease enter valid characters");
        return false;
    }
    return true;
}

const validateNumbers = input =>{
    if(isNaN(input)) {
        console.log("\nPlease enter valid input(in numbers)!");
        return false;
    }
    else
        return true;
}

module.exports = {
    validateNames,
    validateNumbers
}