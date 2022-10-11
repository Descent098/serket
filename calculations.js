

function calculateSHA1Time(possiblePasswords){
    /* Takes in a number of passwords and returns a formatted 
    string indicating how long it would take to crack in sha-1
    
    Meant to be used in template string*/

    let hashRateSHA = 120000000n // Hash rate in hashes/sec interpolated from https://www.onlinehashcrack.com/tools-benchmark-hashcat-nvidia-gtx-1080-ti.php#:~:text=Hashmode%3A%20124%20%2D%20Django,97982.6%20MH/s
    hashRateSHA*=60n // Hashes per min
    hashRateSHA*=60n // Hashes per hour
    timeTakenSHA = possiblePasswords/hashRateSHA // in hours
    if (timeTakenSHA >= 8760n){ // Years
        return `This would take a GTX 1080 approximately ${((possiblePasswords/hashRateSHA)/24n)/365n} Years (assuming <a href="https://www.onlinehashcrack.com/tools-benchmark-hashcat-nvidia-gtx-1080-ti.php#:~:text=Hashmode%3A%20124%20%2D%20Django,97982.6%20MH/s" target="_blank">SHA-1 Hashing</a>).`
    }
    else if (timeTakenSHA >= 24n){ // Days
        return `This would take a GTX 1080 approximately ${(possiblePasswords/hashRateSHA)/24n} Days (assuming <a href="https://www.onlinehashcrack.com/tools-benchmark-hashcat-nvidia-gtx-1080-ti.php#:~:text=Hashmode%3A%20124%20%2D%20Django,97982.6%20MH/s" target="_blank">SHA-1 Hashing</a>).`
    } else {
        return `This would take a GTX 1080 approximately ${possiblePasswords/hashRateSHA} Hours (assuming <a href="https://www.onlinehashcrack.com/tools-benchmark-hashcat-nvidia-gtx-1080-ti.php#:~:text=Hashmode%3A%20124%20%2D%20Django,97982.6%20MH/s" target="_blank">SHA-1 Hashing</a>).`
    }
}

function calculateSHA512Time(possiblePasswords){
    /* Takes in a number of passwords and returns a formatted 
    string indicating how long it would take to crack in sha-512
    
    Meant to be used in template string
    */

    let hashRateSHA512 = 2500n // Hash rate in hashes/sec https://www.onlinehashcrack.com/tools-benchmark-hashcat-nvidia-gtx-1080-ti.php#:~:text=Hashmode%3A%2020200%20%2D%20Python,249.6%20kH/s
    hashRateSHA512*=60n // Hashes per min
    hashRateSHA512*=60n // Hashes per hour
    timeTakenSHA = possiblePasswords/hashRateSHA512 // in hours
    if (timeTakenSHA >= 8760n){ // Years
        return `This would take a GTX 1080 approximately ${((possiblePasswords/hashRateSHA512)/24n)/365n} Years (assuming <a href="https://www.onlinehashcrack.com/tools-benchmark-hashcat-nvidia-gtx-1080-ti.php#:~:text=Hashmode%3A%2020200%20%2D%20Python,249.6%20kH/s" target="_blank">SHA-512 Hashing</a>)`
    }
    else if (timeTakenSHA >= 24n){ // Days
        return `This would take a GTX 1080 approximately ${(possiblePasswords/hashRateSHA512)/24n} Days (assuming <a href="https://www.onlinehashcrack.com/tools-benchmark-hashcat-nvidia-gtx-1080-ti.php#:~:text=Hashmode%3A%2020200%20%2D%20Python,249.6%20kH/s" target="_blank">SHA-512 Hashing</a>)`
    } else {
        return `This would take a GTX 1080 approximately ${possiblePasswords/hashRateSHA512} Hours (assuming <a href="https://www.onlinehashcrack.com/tools-benchmark-hashcat-nvidia-gtx-1080-ti.php#:~:text=Hashmode%3A%2020200%20%2D%20Python,249.6%20kH/s" target="_blank">SHA-512 Hashing</a>)`
    }
}

function calculateResults(){

    // Initialize constants for character amounts
    const totalUppercase= 27n // Amount of characters in alphabet
    const totalNumbers = 10n // Amount of possible number characters
    const totalSymbols = 31n // Total number of possible symbols (i.e. !@#$%^&* etc.)
    const totalCharacters = 95n // The number of total valid characters for passwords
    const precision = 1000n // The numebr of digits of precision in BigInt Calculations (i.e. 1000 = 3 digits)

    // Parse user input
    let characters = BigInt(document.getElementById("characters").value)
    let capitals = BigInt(document.getElementById("capitals").value)
    let symbols = BigInt(document.getElementById("symbols").value)
    let numbers = BigInt(document.getElementById("numbers").value)

    // Check for errors
    if ((capitals + symbols + numbers) > characters){
        console.log("Invalid input")
        resultsDiv.innerHTML = `<h2 style="color: red;">Invalid input</h2>` 
        return
    }

    // Initialize state
    resultsDiv = document.getElementById("results") // Where output messages will be written to
    let initial_password_count = totalCharacters**characters // Initial number of passwords
    let password_count = initial_password_count // The current number of total passwords
    let percentage_lost = 0 // The running total for how many possible passwords have been lost

    // Write initial message to user
    resultsDiv.innerHTML = `<h3>Initial Possible Passwords</h3><br><p>initial possible passwords are: ${initial_password_count}  or ${Number(initial_password_count).toExponential(3)} </p>` 
    
    // Begin calculating change based on parameters
    if (capitals > 0){
        // Calculate changes due to capitals requirements
        password_count = BigInt(password_count / totalCharacters**capitals) * (totalUppercase*capitals)  // The current number of total passwords
        count_lost = initial_password_count - password_count // Number of passwords lost because of requirement
        percentage_lost = (Number(count_lost*precision/initial_password_count)/Number(precision))* 100 // Percentage of original lost TO THIS POINT
        // Broadcast change to user
        resultsDiv.innerHTML += `<br><h3>Capital(s)</h3><br><p>By <strong>requiring</strong> ${capitals} Capital(s) the new number of possible passwords are: ${Number(password_count).toExponential(3)} <br> This means you lost ${Number(count_lost).toExponential(3)} possibilities, or ${percentage_lost}% less than original. <br>${calculateSHA1Time(password_count)} <br>${calculateSHA512Time(password_count)}`
    }
    
    if (symbols > 0){
        // Calculate changes due to symbols requirements (i.e !@#$%^&*-+ etc.)
        password_count = BigInt(password_count / totalCharacters**symbols) * (totalSymbols*symbols)  // The current number of total passwords
        count_lost = initial_password_count - password_count // Number of passwords lost because of requirement
        percentage_lost = (Number(count_lost*precision/initial_password_count)/Number(precision))* 100 // Percentage of original lost TO THIS POINT
        // Broadcast change to user
        resultsDiv.innerHTML += `<br><h3>Symbol(s)</h3><br><p>By <strong>requiring</strong> ${symbols} Symbol(s) (and any other above requirements) the new number of possible passwords are: ${password_count} <br> This means you lost ${count_lost} possibilities, or ${percentage_lost}% less than original. <br>${calculateSHA1Time(password_count)} <br>${calculateSHA512Time(password_count)}`
    }

    if (numbers > 0){
        // Calculate changes due to numbers requirements 
        password_count = BigInt(password_count / totalCharacters**numbers) * (totalNumbers*numbers)  // The current number of total passwords
        count_lost = initial_password_count - password_count // Number of passwords lost because of requirement
        percentage_lost = (Number(count_lost*precision/initial_password_count)/Number(precision))* 100 // Percentage of original lost TO THIS POINT
        // Broadcast change to user
        resultsDiv.innerHTML += `<br><h3>Number(s)</h3><br><p>By <strong>requiring</strong> ${symbols} Number(s) (and any other above requirements) the new number of possible passwords are: ${password_count} <br> This means you lost ${count_lost} possibilities, or ${percentage_lost}% less than original.<br> ${calculateSHA1Time(password_count)}<br> ${calculateSHA512Time(password_count)}`
    }
}