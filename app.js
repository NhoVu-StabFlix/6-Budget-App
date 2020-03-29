//Budget Controller
var budgetController = (function() {
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;



    };
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };
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
        //Calculate Total income and expense
    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(cur) {
            sum += cur.value;

        });
        data.totals[type] = sum;


    };
    //Calculate Percentage Expense
    Expense.prototype.calcPercentage = function(totalIncome) {

            if (totalIncome > 0) {
                this.percentage = Math.round((this.value / totalIncome) * 100);
            } else {
                this.percentage = -1;
            }

        }
        // return Percentage Expense 
    Expense.prototype.getPercentage = function() {
        return this.percentage;
    }




    //Create Data Constructure



    return {
        addItem: function(type, des, val) {
            var newItem, ID;

            //Create New ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            // Create New item base on 'inc' or 'exp'
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
        //Delete Item
        deleteItem: function(type, id) {
            var ids, index;
            ids = data.allItems[type].map(function(current) {
                return current.id;
            });
            index = ids.indexOf(id);
            if (index !== -1) {
                data.allItems[type].splice(index, 1);

            }

        },
        //Calculate Percentages
        calculatePercentages: function() {
            //1.calculate Percentage
            data.allItems.exp.forEach(function(cur) {
                cur.calcPercentage(data.totals.inc);
            });


        },
        getPercentages: function() {
            var allPerc = data.allItems.exp.map(function(cur) {
                return cur.getPercentage();
            });
            return allPerc;

        },

        // Test Data structure
        testing: function() {
            console.log(this.getPercentages.allPerc);
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
        container: '.container',
        expensePercentageLabel: '.item__percentage',
        date: '.budget__title--month'

    };
    var formatNumber = function(num, type) {
        var numSplit, int, dec, type;
        num = Math.abs(num);
        num = num.toFixed(2);
        numSplit = num.split('.');
        int = numSplit[0];
        dec = numSplit[1];
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, int.length);
        }
        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
    }
    var nodeListForEach = function(list, callback) {
        for (i = 0; i < list.length; i++) {
            callback(list[i], i);

        }
    };

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
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">10%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'inc') {
                element = DOMStrings.incomeContainer;
                html = ' <div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

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
            var type;
            obj.budget > 0 ? type === 'inc' : type === 'exp';
            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalInc, type);
            document.querySelector(DOMStrings.expensesLabel).textContent = formatNumber(obj.totalExp, type);

            if (obj.percentage > 0) {
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + ' %';
            } else {
                document.querySelector(DOMStrings.percentageLabel).textContent = '---';
            }





        },
        deleteListItem: function(selectorID) {
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);


        },
        displayPercentages: function(percentages) {
            var fields = document.querySelectorAll(DOMStrings.expensePercentageLabel);


            nodeListForEach(fields, function(current, index) {
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + ' %';
                } else {
                    current.textContent = '---';
                }

            });



        },
        displayMonth: function() {
            var year, month, months, now;
            now = new Date();
            year = now.getFullYear();
            month = now.getMonth();
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            document.querySelector(DOMStrings.date).textContent = months[month] + ' ' + year;


        },
        changedType: function() {
            var fields;
            fields = document.querySelectorAll(DOMStrings.inputType + ',' + DOMStrings.inputDescription + ',' + DOMStrings.value);
            nodeListForEach(fields, function(cur) {
                cur.classList.toggle('red-focus');
            })
            document.querySelector(DOMStrings.inputBtn).classList.add('red');


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




    };
    var updatePercentages = function() {
        //1.calculate Percentage
        budgetCtrl.calculatePercentages();


        //2.Read Percentage from the budgetController
        var Percentages = budgetCtrl.getPercentages();


        //3 Update pUI with new 
        UICtrl.displayPercentages(Percentages);




    };






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

            //7. Calculate and update percentage
            updatePercentages();

        }


        //Update percentage














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
            //1.delete the item from the data structure
            budgetCtrl.deleteItem(type, ID);

            //2.delete the item from the UI
            UICtrl.deleteListItem(itemID);
            //3.Update and show the new budget
            updateBudget();
            updatePercentages();



        }



    };


    // Handle event input from keyboard
    var setupEventListeners = function() {

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function(event) {
            if (event.keyCode === 13) {
                ctrlAddItem();
            }
        });
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);

    };
    // Run init function the first
    return {
        init: function() {
            UICtrl.displayMonth();
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