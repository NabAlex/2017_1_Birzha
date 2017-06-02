import currentroom from '../../../templates/currentroom';

class UserListBoard {
    constructor(root) {
        this.root = root;
    }

    update(userList) {
        this.root.innerHTML = currentroom({
            listUsers: userList
        });
    }

    // todo
}

export default UserListBoard;