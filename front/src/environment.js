const environments = {
    local: {
        api: "http://localhost:3000"
    },
};
export default function getEnvironment() {
    //at this writing there's only one environment
    //TODO make this environment dependent
    return environments.local;
}
