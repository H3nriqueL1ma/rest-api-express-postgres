import bcrypt from "bcrypt";

export async function encryptCredentials (password) {
    const saltRounds = 10;
    const hashPass = await bcrypt.hash(password, saltRounds)
    .then(hash => {
        return hash;
    })
    .catch(error => console.log(error));

    return hashPass;
}

export async function validateCredentials (password, hashPass) {
    const validate = await bcrypt.compare(password, hashPass)
    .then(res => {
        return res;
    })
    .catch(error => console.log(error));

    return validate;
}