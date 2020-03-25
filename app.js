//Budget Controller
var budgetController = (function() {
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;



    };
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(cur) {
            sum += cur.value;

        });
        data.totals[type] = sum;


    };






    //Create Data Constructure
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0

        },
        budget: 0,
        percentage: -1
    }


    return {
        addItem: function(type, des, val) {
            var newItem, ID;

            //Create Mew ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            // Create Mew item base on 'inc' or 'exp'
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);

            }
            //Push it into our data structure
            data.allItems[type].push(newItem);
            //return new Element
            return newItem;


        },
        //Calculate Budget 
        CalculateBudget: function() {
            //Calculate total Income and Expense
            calculateTotal('exp');
            calculateTotal('inc');
            data.budget = data.totals.inc - data.totals.exp;
            data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);




        },
        deleteItem: function(type, id) {
            var ids, index;
            ids = data.allItems[type].map(function(current) {
                return current.id;
            });
            index = ids.indexOf(id);
            if (index !== -1) {
                data.allItems[type].splice(index, 1);

            }

        }



        ,
        testing: function() {
            console.log(data);
        },
        getBudget: function() {

            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }

        }





    }





})();









//UI Controller
var UIController = (function() {
    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container'

    }

    return {
        getInput: function() {
            return {

                // get value from keyboard { Type , Description,Value}

                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)

            }



        },
        getDOMStrings: function() {
            return DOMStrings;

        },
        addListItem: function(obj, type) {
            var html, newHtml, element;
            //Create HTML string with placeholder text
            if (type === 'exp') {
                element = DOMStrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'

            } else if (type === 'inc') {
                element = DOMStrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">10%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },
        clearFields: function() {
            var fields, fieldsarr;
            fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);
            fieldsarr = Array.prototype.slice.call(fields);
            fieldsarr.forEach(function(current, index, array) {
                current.value = "";

            });
            fieldsarr[0].focus();


        },
        displayBudget: function(obj) {
            document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMStrings.expensesLabel).textContent = obj.totalExp;
            document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';


        }






    }





})();









//Global app Controller
var controller = (function(budgetCtrl, UICtrl) {
    var DOM = UICtrl.getDOMStrings();

    var updateBudget = function() {
        var budget;
        //Calculate Total 
        budgetCtrl.calculateTotal;
        budgetCtrl.CalculateBudget();
        //Return Budget
        budget = budgetCtrl.getBudget();
        UICtrl.displayBudget(budget);



    }





    // Control Add Item after click button 
    var ctrlAddItem = function() {
        var input, newItem, addItem;
        //1.Get the field input data

        input = UICtrl.getInput();
        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            console.log(input);
            //2 . Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            //3. Add the item to the UI
            UICtrl.addListItem(newItem, input.type);
            //4.Calculate the budget

            //5.Clear field input UI Controller
            UICtrl.clearFields();


            //6. Display the budget on the UI
            updateBudget();
        }













    };
    //Control Delete
    var ctrlDeleteItem = function(event) {
        var itemID, splitID, ID, type;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (itemID) {
            //inc-1
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            budgetCtrl.deleteItem(type, ID);
            //1.delete the item from the data structure
            //2.delete the item from the UI
            //3.Update and show the new budget


        }



    }


    // Handle event input from keyboard
    var setupEventListeners = function() {

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function(event) {
            if (event.keyCode === 13) {
                ctrlAddItem();
            }
        });
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

    };
    // Run init function the first
    return {
        init: function() {

            setupEventListeners();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: 0
            })
        }
    };












})(budgetController, UIController);
controller.init();