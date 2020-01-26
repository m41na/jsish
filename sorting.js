const source = [20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0];
//const source = [4, 10, 8, 7, 6, 5, 3, 12, 14, 2];

//bubble sort
const bubble = (array) => {
    for (let x = 0; x < array.length; x++) {
        for (let y = 1; y < array.length - x; y++) {
            let next = array[y];
            if (array[y - 1] > next) {
                array[y] = array[y - 1];
                array[y - 1] = next;
            }
            //console.log(array)
        }
    }
}

let array1 = [...source];
bubble(array1);
console.log(array1)
console.log("----------------------");

//insertion sort
const insertion = (array) => {
    for (let i = 0; i < array.length; i++) {
        let curr = array[i];
        for (let y = array.length; y > i; y--) {
            let next = array[y];
            if (curr > next) {
                array[y] = array[y - 1];
                array[y - 1] = next;
            }
            //console.log(array)
        }
    }
}

let array2 = [...source];
insertion(array2);
console.log(array2)
console.log("----------------------");

//selection sort
const selection = (array) => {
    for (let i = 0; i < array.length; i++) {
        let curr = i;
        for (let j = i; j < array.length; j++) {
            if (array[j] < array[curr]) {
                curr = j;
            }
        }
        let smallest = array[curr];
        array[curr] = array[i];
        array[i] = smallest;
    }
}

let array3 = [...source];
selection(array3);
console.log(array3)
console.log("----------------------");

//merge sort
const merge_sort = (source) => {

    function merge(left, right) {
        let array = [];
        let i = 0, j = 0;
        while (i < left.length && j < right.length) {
            if (left[i] < right[j]) {
                array.push(left[i]);
                i++;
            }
            else {
                array.push(right[j]);
                j++;
            }
        }

        if (i < left.length) {
            for (let x = i; x < left.length; x++) {
                array.push(left[x]);
            }
        }

        if (j < right.length) {
            for (let x = i; x < right.length; x++) {
                array.push(right[x]);
            }
        }

        return array;
    }

    function split(array) {
        if (array.length > 1) {
            let mid = array.length / 2;
            return merge(split([...array.slice(0, mid)]), split([...array.slice(mid)]))
        }
        else {
            return array;
        }
    }

    return split(source);
}

let array4 = merge_sort([...source]);
console.log(array4);
console.log("----------------------");

//quick sort
const quick_sort = (source) => {

    function partition(array, low, high) {
        let pivot = array[high];
        let i = low - 1;
        let j = high - 1;
        while (j > i) {
            //stop if i-th element is bigger than pivot
            do {
                i++;
            } while (i < high && array[i] <= pivot);

            //stop if j-th element is smaller than pivot
            while (j > low && array[j] > pivot) {
                j--;
            }

            //swap with i-th and j-th elements
            if (i < j) {
                let temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
            //console.log(array);
        }
        //return i as new pivot
        array[high] = array[i];
        array[i] = pivot;
        return i;
    }

    function sort(array, low, high) {
        if (low < high) {
            let index = partition(array, low, high);
            sort(array, low, index - 1);
            sort(array, index + 1, high);
        }
    }

    return sort(source, 0, source.length - 1);
}

let array5 = [...source];
quick_sort(array5);
console.log(array5);
console.log("----------------------");

function TreeNode(value) {
    this.value = value;
    this.left;
    this.right;

    this.insert = (value) => {
        if (value > this.value) {
            if (!this.right) {
                this.right = new TreeNode(value);
            }
            else {
                this.right.insert(value);
            }
        }
        else {
            if (!this.left) {
                this.left = new TreeNode(value);
            }
            else {
                this.left.insert(value);
            }
        }
    }

    this.find = (value) => {
        if (this.value === value) return this;
        if (value < this.value && this.left !== null) {
            return this.left.find(value);
        }
        if (value > this.value && this.right != null) {
            return right.find(value);
        }
        return null;
    }

    this.min = () => {
        if (!this.left) {
            return this.value;
        }
        else {
            return this.left.min();
        }
    }

    this.max = () => {
        if (!this.right) {
            return this.value;
        }
        else {
            return this.right.max();
        }
    }

    this.delete = (value) => {

    }

    this.print = (type) => {
        const inOrder = () => {
            if (this.left) {
                this.left.print(type);
            }
            console.log(this.value)
            if (this.right) {
                this.right.print(type)
            }
        }

        const preOrder = () => {
            console.log(this.value)
            if (this.left) {
                this.left.print(type);
            }
            if (this.right) {
                this.right.print(type)
            }
        }

        const postOrder = () => {
            if (this.left) {
                this.left.print(type);
            }
            if (this.right) {
                this.right.print(type)
            }
            console.log(this.value)
        }

        switch (type) {
            case 1:
                inOrder();
                break;
            case 2:
                preOrder();
                break;
            case 3:
                postOrder();
                break;
            default:
                console.log('defaulting to in-order enumeration')
                inOrder();
                break;
        }
    }
}

function BSTree() {

    let root;

    this.insert = (value) => {
        if (!root) {
            root = new TreeNode(value);
        } else {
            root.insert(value);
        }
    }

    this.find = (value) => {
        if (!root) {
            return null;
        }
        else {
            return root.find(value);
        }
    }

    this.min = () => {
        return (!root) ? null : root.min();
    }

    this.max = () => {
        return (!root) ? null : root.max();
    }

    this.print = (type) => {
        if (root) {
            root.print(type)
        }
        else {
            console.log('empty tree');
        }
    }
}

const tree = new BSTree();
[...source].forEach(value => tree.insert(value));
console.log(`min: ${tree.min()}`)
console.log(`max: ${tree.max()}`)
tree.print(2);
console.log("----------------------");

function HeapNode(value) {
    this.value = value;
    this.left;
    this.right;

    this.insert = (value) => {
        if (!this.left) {
            this.left = new TreeNode(value);
        }
        else {
            this.left.insert(value);
        }

        if (!this.right) {
            this.right = new TreeNode(value);
        }
        else {
            this.right.insert(value);
        }
    }

    this.find = (value) => {
        if (this.value === value) return this;
        if (value < this.value && this.left !== null) {
            return this.left.find(value);
        }
        if (value > this.value && this.right != null) {
            return right.find(value);
        }
        return null;
    }

    this.min = () => {
        if (!this.left) {
            return this.value;
        }
        else {
            return this.left.min();
        }
    }

    this.max = () => {
        if (!this.right) {
            return this.value;
        }
        else {
            return this.right.max();
        }
    }

    this.delete = (value) => {

    }

    this.print = (type) => {
        const inOrder = () => {
            if (this.left) {
                this.left.print(type);
            }
            console.log(this.value)
            if (this.right) {
                this.right.print(type)
            }
        }

        const preOrder = () => {
            console.log(this.value)
            if (this.left) {
                this.left.print(type);
            }
            if (this.right) {
                this.right.print(type)
            }
        }

        const postOrder = () => {
            if (this.left) {
                this.left.print(type);
            }
            if (this.right) {
                this.right.print(type)
            }
            console.log(this.value)
        }

        switch (type) {
            case 1:
                inOrder();
                break;
            case 2:
                preOrder();
                break;
            case 3:
                postOrder();
                break;
            default:
                console.log('defaulting to in-order enumeration')
                inOrder();
                break;
        }
    }
}

function Heap() {

    let root;
}

function GraphNode(value) {
    this.value = value;
    this.left;
    this.right;
}

function Graph() {

    let root;
}
