const error_codes = {
  E0: "undefined error occured",
  E1: "unexpected values recieved",
  E2: "token validation failed",
  E3: "values not found in database",
};

const logical_errors = {
  L1: "user already exists",
  L2: "not enough points",
  L3: "requested node is not locked",
  L4: "not enough penalty points",
  L5: "another question already locked",
  L6: "requested question is not unlocked",
  L7: "requested question is already solved",
  L8: "incorrect answer for requested question",
  L9: "hint already available"
};

const success_codes = {
  S0: "all nodes solved game over",
  S1: "validated correctly",
  S2: "answer correct",
  S3: "penalty points reduced",
  S4: "hint given for requested question",
  S5: "user inserted successfully",
  S6: "question inserted successfully",
  S7: "question returned and locked successfully",
};

module.exports = { error_codes, logical_errors, success_codes };
