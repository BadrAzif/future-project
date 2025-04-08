const logger = {
    info: (message) => {
        console.log(`[INFO]${new Date().toISOString()} ${message}`);
    },
    error: (message, error) => {
        console.log(`[ERROR]${new Date().toISOString()} ${message}, ${error}`);
    },

    warn: (message) => {
        console.log(`[WARN]${new Date().toISOString()} ${message}`);
    },

    debug: (message) => {
        console.log(`[DEBUG]${new Date().toISOString()} ${message}`);
    }
}
export default logger