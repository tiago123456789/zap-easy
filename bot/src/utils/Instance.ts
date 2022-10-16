
class Instance {

    static getId() {
        let id = process.argv[2]
        if (!id) {
            return null;
        }

        return id;
    }
}

export default Instance;