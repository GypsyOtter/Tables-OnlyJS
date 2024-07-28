(() => {
    let tableName;
    let tableInfo;
    let objectsList;
    let cols;


    const createTableHeader = (cols) => {
        let tableHeader = document.createElement('thead');
        let tableRow = document.createElement('tr');
        let sortUpBtns = [];
        let sortDownBtns = [];

        for (let col of cols) {
            let name = col.name;
            let tableHeading = document.createElement('th');
            tableHeading.classList.add('tableElement')
            let headingElement = document.createElement('div');
            headingElement.classList.add('tableHeadingElement');
            headingElement.innerHTML = name;

            let sortUpBtn = document.createElement('div');
            sortUpBtn.classList.add('sortBtn', 'btn');
            sortUpBtn.innerHTML = '&#5123;';
            sortUpBtns.push(sortUpBtn);

            let sortDownBtn = document.createElement('div');
            sortDownBtn.classList.add('sortBtn', 'btn');
            sortDownBtn.innerHTML = '&#5121;';
            sortDownBtns.push(sortDownBtn);

            headingElement.append(sortUpBtn);
            headingElement.append(sortDownBtn);
            tableHeading.append(headingElement);
            tableRow.append(tableHeading);
        }

        tableHeader.append(tableRow);
        return { tableHeader, sortUpBtns, sortDownBtns };
    }

    const createTableBody = (objectsList) => {
        let tableBody = document.createElement('tbody');
        for (let index in objectsList) {
            let objectValues = Object.values(objectsList[index]);
            let newRow = document.createElement('tr');
            for (let i in objectValues) {
                let newCell = +i === 0 ? document.createElement('th') : document.createElement('td');
                newCell.classList.add('tableElement');
                newCell.innerHTML = objectValues[i];
                newRow.append(newCell);
            }

            let deleteBtnCell = document.createElement('td');
            deleteBtnCell.classList.add('tableElement');
            let deleteRowBtn = document.createElement('button');
            deleteRowBtn.innerHTML = 'X';
            deleteRowBtn.classList.add('btn', 'redBtn', 'deleteRowBtn');
            deleteRowBtn.addEventListener('click', () => {
                createDeleteRowModal(index);
            })
            deleteBtnCell.append(deleteRowBtn);
            newRow.append(deleteBtnCell);

            tableBody.append(newRow);
        }
        return tableBody;
    }

    const createTableFooter = (cols) => {
        let tableFooter = document.createElement('tfoot');
        let footerRow = document.createElement('tr');

        let footerData = document.createElement('td');
        footerData.classList.add('tableElement');
        footerData.colSpan = cols.length;

        let formDiv = document.createElement('div');
        formDiv.classList.add('lastRow');

        let inputFields = [];

        for (let col of cols) {
            let name = col.name;
            let inputField = document.createElement('input');
            inputField.placeholder = name;
            inputField.classList.add('elementInputField');
            inputFields.push(inputField);
            formDiv.append(inputField);
        }

        let addElementBtn = document.createElement('div');
        addElementBtn.innerHTML = "Добавить";
        addElementBtn.classList.add('addElementBtn', 'btn');

        formDiv.append(addElementBtn);
        footerData.append(formDiv);
        footerRow.append(footerData);
        tableFooter.append(footerRow);

        return { tableFooter, inputFields, addElementBtn };
    }

    const createTable = (cols, objectsList) => {
        let container = document.getElementById('tableContainer');

        if (container.childNodes.length > 0) {
            let childNumber = container.childNodes.length;
            for (let i = 0; i < childNumber; i++) {
                container.childNodes[0].remove();
            }
        }

        let tableHeading = document.createElement('div');
        tableHeading.classList.add('tableHeading');
        tableHeading.innerHTML = localStorage.getItem('targetTable');
        let returnToIndexTableBtn = document.createElement('button');
        returnToIndexTableBtn.classList.add('btn', 'returnToIndexBtn');
        returnToIndexTableBtn.innerHTML = '&#5130;';
        returnToIndexTableBtn.addEventListener('click', () => {
            returnToIndexTable();
        })
        tableHeading.prepend(returnToIndexTableBtn);
        container.append(tableHeading);

        let table = document.createElement('table');
        table.classList.add('mainTable');
        let tableHeader = createTableHeader(cols);
        let tableBody = createTableBody(objectsList);
        let tableFooter = createTableFooter(cols);

        tableFooter.addElementBtn.addEventListener('click', () => {
            let inputFieldsValues = tableFooter.inputFields.map((field) => (field = field.value));
            if (inputFieldsValues.every(e => e)) {
                createNewRow(inputFieldsValues);
                tableFooter.inputFields.map(e => e.value = '');
            }
        })

        for (let i in tableHeader.sortUpBtns) {
            tableHeader.sortUpBtns[i].addEventListener('click', () => { sortByCol(cols, i, 'up', table) });
            tableHeader.sortDownBtns[i].addEventListener('click', () => { sortByCol(cols, i, 'down', table) });
        }

        table.append(tableHeader.tableHeader);
        table.append(tableBody);
        table.append(tableFooter.tableFooter);
        container.append(table);

        return [tableHeader.sortUpBtns, tableHeader.sortDownBtns];
    }

    const createNewRow = (inputFieldsValues) => {
        let objKeys = cols.map((e, index) => e = 'col' + (index + 1));
        let object = {}
        for (let i = 0; i < inputFieldsValues.length; i++) {
            object[objKeys[i]] = inputFieldsValues[i]
        }
        objectsList.push(object);
        localStorage.setItem(tableName, JSON.stringify({ objList: objectsList, cols: cols }));
        refreshTable();
    }

    const deleteRow = (index) => {
        objectsList.splice(index, 1);
        localStorage.setItem(tableName, JSON.stringify({ objList: objectsList, cols: cols }));
        refreshTable();
    }

    const createDeleteRowModal = (index) => {
        let body = document.getElementById('body');
        let deleteRowModalBackdrop = document.createElement('div');
        deleteRowModalBackdrop.classList.add('addTableFormBackdrop');
        let deleteRowModal = document.createElement('div');
        deleteRowModal.classList.add('deleteTableModal');

        deleteRowModalBackdrop.addEventListener('click', (event) => {
            if (event.target === deleteRowModalBackdrop) closeModal(deleteRowModal, deleteRowModalBackdrop);
        })

        let modalHeading = document.createElement('div');
        modalHeading.classList.add('formTop');
        modalHeading.innerHTML = 'Удалить эту строку?';

        let modalBody = document.createElement('div');
        modalBody.classList.add('modalBody');

        let deleteRowBtnAgree = document.createElement('button');
        deleteRowBtnAgree.classList.add('btn', 'redBtn', 'deleteTableModalBtn');
        deleteRowBtnAgree.innerHTML = 'Да';

        deleteRowBtnAgree.addEventListener('click', () => {
            deleteRow(index);
            closeModal(deleteRowModal, deleteRowModalBackdrop);
        })

        let deleteRowBtnDisagree = document.createElement('button');
        deleteRowBtnDisagree.classList.add('btn', 'deleteTableModalBtn');
        deleteRowBtnDisagree.innerHTML = 'Нет';

        deleteRowBtnDisagree.addEventListener('click', () => {
            closeModal(deleteRowModal, deleteRowModalBackdrop);
        })

        modalBody.append(deleteRowBtnAgree);
        modalBody.append(deleteRowBtnDisagree);

        deleteRowModal.append(modalHeading);
        deleteRowModal.append(modalBody);
        deleteRowModalBackdrop.append(deleteRowModal);
        body.append(deleteRowModalBackdrop);
    }

    const closeModal = (modal, modalBackdrop) => {
        modal.remove();
        modalBackdrop.remove();
    }

    const sortByCol = (cols, colNum, direction, tableToDelete) => {
        objectsList = direction === 'up' ? sortArrByObjProperty(objectsList, 'col' + (+colNum + 1), cols[colNum].type) : sortArrByObjProperty(objectsList, 'col' + (+colNum + 1), cols[colNum].type).reverse();
        localStorage.setItem(tableName, JSON.stringify({ objList: objectsList, cols: cols }));
        tableToDelete.remove();
        let [sortUpBtns, sortDownBtns] = createTable(cols, objectsList);
        for (let i in sortUpBtns) {
            sortUpBtns[i].classList.remove('sortBtnActive');
            sortDownBtns[i].classList.remove('sortBtnActive');
        }
        if (direction === 'up') sortUpBtns[colNum].classList.add('sortBtnActive');
        else sortDownBtns[colNum].classList.add('sortBtnActive');
    }

    const sortArrByObjProperty = (arr, propName, type) => {
        let sortedArr;
        if (type === 'int') sortedArr = arr.sort((a, b) => (parseInt(a[propName]) >= parseInt(b[propName])) ? 1 : -1);
        else sortedArr = arr.sort((a, b) => (a[propName] >= b[propName]) ? 1 : -1);
        return sortedArr;
    }

    const refreshTable = () => {
        tableName = localStorage.getItem('targetTable');
        tableInfo = JSON.parse(localStorage.getItem(localStorage.getItem('targetTable')));
        objectsList = tableInfo.objList;
        cols = tableInfo.cols;
        createTable(cols, objectsList);
    }

    const returnToIndexTable = () => {
        document.getElementById('tableContainer').childNodes[1].remove();
        document.getElementById('tableContainer').childNodes[0].remove();
        localStorage.setItem('targetTable', 'indexTable');
        window.refreshIndexTable();
    }

    window.refreshTable = refreshTable;
})();