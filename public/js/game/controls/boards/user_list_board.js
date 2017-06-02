import currentroom from '../../../templates/currentroom';

class UserListBoard {
    constructor(root) {
        root.innerHTML = currentroom({
            listUsers: [] /* null */
        });

        this.root = root;
    }

    update(userList) {
        this.root.innerHTML = currentroom({
            listUsers: userList
        });
    }
}

export default UserListBoard;