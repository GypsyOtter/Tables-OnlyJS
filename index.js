import 'https://tomashubelbauer.github.io/github-pages-local-storage/index.js';
(() => {
    let tables;

    tables = JSON.parse(localStorage.getItem('tables'));
    console.log(tables);
    if (tables === null){
        tables = []
        localStorage.setItem('tables', tables);
    }
    console.log(tables);

    const createTableBody = (tables) => {
        let tableBody = document.createElement('tbody');
        let goToTableBtns = [];
        let deleteTableBtns = [];

        for (let table of tables) {
            let tableRow = document.createElement('tr');
            let tableData = document.createElement('td');
            let btnsContainer = document.createElement('div');
            let goToTableBtn = document.createElement('button');
            let deleteTableBtn = document.createElement('button');

            tableData.classList.add('indexTableElement');
            tableData.innerHTML = table.name;

            btnsContainer.classList.add('btnsContainer');

            goToTableBtn.innerHTML = '&#5125;';
            goToTableBtn.classList.add('btn', 'goToTableBtn');
            goToTableBtns.push(goToTableBtn);

            deleteTableBtn.innerHTML = 'X';
            deleteTableBtn.classList.add('btn', 'redBtn');
            deleteTableBtns.push(deleteTableBtn);
            
            btnsContainer.append(goToTableBtn);
            btnsContainer.append(deleteTableBtn);
            tableData.append(btnsContainer);
            tableRow.append(tableData);
            tableBody.append(tableRow);
        }

        return { tableBody, goToTableBtns, deleteTableBtns };
    }

    const createTableFooter = () => {
        let tableFooter = document.createElement('tfoot');
        let tableRow = document.createElement('tr');
        let tableData = document.createElement('td');
        tableData.classList.add('indexTableElement');
        let addTableBtn = document.createElement('button');
        addTableBtn.classList.add('btn', 'addTableBtn');

        addTableBtn.innerHTML = 'Добавить таблицу';
        tableData.append(addTableBtn);
        tableRow.append(tableData);
        tableFooter.append(tableRow);

        return { tableFooter, addTableBtn };
    }

    const createIndexTable = (tables) => {
        let tableContainer = document.getElementById('indexTableContainer');

        if (tableContainer.childNodes.length > 0) {
            let childNumber = tableContainer.childNodes.length;
            for (let i = 0; i < childNumber; i++) {
                tableContainer.childNodes[0].remove();
            }
        }

        let indexTableHeading = document.createElement('div');
        indexTableHeading.classList.add('tableHeading')
        indexTableHeading.innerHTML = 'Мои таблицы';
        tableContainer.append(indexTableHeading);

        let indexTable = document.createElement('table');
        indexTable.classList.add('indexTable');
        let tableBody = createTableBody(tables);
        let tableFooter = createTableFooter();

        for (let index in tables){
            tableBody.goToTableBtns[index].addEventListener('click', () => {
                goToTable(tables[index].name);
            });
            tableBody.deleteTableBtns[index].addEventListener('click', () => {
                createDeleteTableModal(index, tables[index].name);
            });
        }

        tableFooter.addTableBtn.addEventListener('click', () => {
            createAddTableForm(tableBody);
        })

        indexTable.append(tableBody.tableBody);
        indexTable.append(tableFooter.tableFooter);
        tableContainer.append(indexTable);
    }

    const createAddTableForm = () => {
        let body = document.getElementById('body');
        let addTableFormBackdrop = document.createElement('div');
        addTableFormBackdrop.classList.add('addTableFormBackdrop');
        let addTableForm = document.createElement('div');
        addTableForm.classList.add('addTableForm');

        addTableFormBackdrop.addEventListener('click', (event) => {
            if (event.target === addTableFormBackdrop) closeModal(addTableForm, addTableFormBackdrop);
        })

        let formTop = document.createElement('div');
        formTop.classList.add('formTop');
        let formTopHeading = document.createElement('div');
        formTopHeading.innerHTML = 'Название новой таблицы';
        let tableNameInputField = document.createElement('input');
        tableNameInputField.placeholder = 'Введите название...';
        tableNameInputField.classList.add('tableNameInputField');
        formTop.append(formTopHeading);
        formTop.append(tableNameInputField);

        let formBody = document.createElement('div');
        formBody.classList.add('formBody');
        let formBodyHeading = document.createElement('div');
        formBodyHeading.classList.add('formBodyHeading');
        formBodyHeading.innerHTML = 'Поля таблицы';
        let addNewFieldBtn = document.createElement('button');
        addNewFieldBtn.innerHTML = 'Добавить новое поле';
        addNewFieldBtn.classList.add('btn');
        addNewFieldBtn.addEventListener('click', () => {
            addNewFormField(formBody, addNewFieldBtn);
        })
        formBody.append(formBodyHeading);
        formBody.append(addNewFieldBtn);

        let formBottom = document.createElement('div');
        let submitBtn = document.createElement('button');
        submitBtn.classList.add('btn', 'submitBtn');
        submitBtn.innerHTML = 'Создать таблицу';
        submitBtn.addEventListener('click', () => {
            if (tableNameInputField.value && Array.from(formBody.childNodes).slice(1, formBody.children.length-1).every(e => e.children[0].value)) {
                let tableFieldsValues = [];
                for (let i = 1; i < formBody.children.length-1; i++){
                    tableFieldsValues.push({name: formBody.children[i].children[0].value, type: formBody.children[i].children[1].value});
                }
                addNewTable(tableNameInputField.value, tableFieldsValues);
                closeModal(addTableForm, addTableFormBackdrop);
            }
        })
        formBottom.append(submitBtn);

        addTableForm.append(formTop);
        addTableForm.append(formBody);
        addTableForm.append(formBottom);
        addTableFormBackdrop.append(addTableForm);
        body.append(addTableFormBackdrop);
    }

    const addNewFormField = (formBody, lastElement) => {
        let newFieldContainer = document.createElement('div');
        newFieldContainer.classList.add('newFieldContainer');
        let newFieldNameInput = document.createElement('input');
        newFieldNameInput.placeholder = 'Имя поля...'
        let newFieldTypeSelect = document.createElement('select');
        let removeFieldBtn = document.createElement('button');
        removeFieldBtn.classList.add('btn', 'redBtn');
        removeFieldBtn.innerHTML = 'X';

        removeFieldBtn.addEventListener('click', () => {
            newFieldContainer.remove();
        })

        let intType = document.createElement('option');
        intType.value = 'int';
        intType.innerHTML = 'Число';
        let stringType = document.createElement('option');
        stringType.value = 'string';
        stringType.innerHTML = 'Строка';
        newFieldTypeSelect.append(intType);
        newFieldTypeSelect.append(stringType);

        newFieldContainer.append(newFieldNameInput);
        newFieldContainer.append(newFieldTypeSelect);
        newFieldContainer.append(removeFieldBtn);
        formBody.insertBefore(newFieldContainer, lastElement);
    }

    const addNewTable = (name, tableFields) => {
        tables.push({ name: name });
        localStorage.setItem(name, JSON.stringify({objList: [], cols: tableFields}))
        localStorage.setItem('tables', JSON.stringify(tables));
        refreshIndexTable();
    }

    const closeModal = (modal, modalBackdrop) => {
        modal.remove();
        modalBackdrop.remove();
    }

    const goToTable = (tableName) => {
        document.getElementById('indexTableContainer').childNodes[1]?.remove();
        document.getElementById('indexTableContainer').childNodes[0]?.remove();
        localStorage.setItem('targetTable', tableName);
        console.log(tableName);
        window.refreshTable();
    }

    const deleteTable = (index, tableName) => {
        tables.splice(index, 1);
        localStorage.setItem('tables', JSON.stringify(tables));
        localStorage.removeItem(tableName);
        refreshIndexTable();
    }

    const createDeleteTableModal = (index, tableName) => {
        let body = document.getElementById('body');
        let deleteTableModalBackdrop = document.createElement('div');
        deleteTableModalBackdrop.classList.add('addTableFormBackdrop');
        let deleteTableModal = document.createElement('div');
        deleteTableModal.classList.add('deleteTableModal');

        deleteTableModalBackdrop.addEventListener('click', (event) => {
            if (event.target === deleteTableModalBackdrop) closeModal(deleteTableModal, deleteTableModalBackdrop);
        })

        let modalHeading = document.createElement('div');
        modalHeading.classList.add('formTop');
        modalHeading.innerHTML = 'Вы правда хотите удалить таблицу: ' + tableName + '?';

        let modalBody = document.createElement('div');
        modalBody.classList.add('modalBody');

        let deleteTableBtnAgree = document.createElement('button');
        deleteTableBtnAgree.classList.add('btn', 'redBtn', 'deleteTableModalBtn');
        deleteTableBtnAgree.innerHTML = 'Да';

        deleteTableBtnAgree.addEventListener('click', () => {
            deleteTable(index, tableName);
            closeModal(deleteTableModal, deleteTableModalBackdrop);
        })

        let deleteTableBtnDisagree = document.createElement('button');
        deleteTableBtnDisagree.classList.add('btn', 'deleteTableModalBtn');
        deleteTableBtnDisagree.innerHTML = 'Нет';

        deleteTableBtnDisagree.addEventListener('click', () => {
            closeModal(deleteTableModal, deleteTableModalBackdrop);
        })

        modalBody.append(deleteTableBtnAgree);
        modalBody.append(deleteTableBtnDisagree);

        deleteTableModal.append(modalHeading);
        deleteTableModal.append(modalBody);
        deleteTableModalBackdrop.append(deleteTableModal);
        body.append(deleteTableModalBackdrop);
    }


    const refreshIndexTable = () => {
        if (localStorage.getItem('targetTable') === 'indexTable' || !localStorage.getItem('targetTable')){
            createIndexTable(tables);
        }
        else {
            goToTable(localStorage.getItem('targetTable'));
        }
    }

    window.refreshIndexTable = refreshIndexTable;


    document.addEventListener('DOMContentLoaded', () => {
        refreshIndexTable();
    })
})();