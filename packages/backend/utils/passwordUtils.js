import bcrypt from "bcrypt";

export const hashingPassword = (password) => {
  const saltRounds = 10;
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        console.error("Error hashing password:", err);
        reject(err);
      } else {
        resolve(hash);
      }
    });
  });
};

export const comparePassword = (password, hash) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, (err, result) => {
      if (err) {
        console.error("Error comparing password:", err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};
