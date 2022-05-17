// function to check, if you have defined the env file properly
export default function isEnvDefined() {
  if (!process.env.REACT_APP_OMDB_API_KEY) {
    throw new Error("env file not defined properly, check README.md file");
  }

  return true
};
