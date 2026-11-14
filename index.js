// profile section
let Createprofile = document.querySelector(".profile");
let Overlay = document.querySelector(".overlay");
let closeprofile = document.querySelector("#close-profile");

let displayname = document.querySelector("#profile-name");
let displayimage = document.querySelector("#imagedisplay");
let displaysecondname = document.querySelector("#name-two");

let profilename = document.querySelector("#name");
let profileimage = document.querySelector("#imageurl");

let submitbutton = document.querySelector("#done");

Createprofile.addEventListener("click", function () {
  Overlay.style.display = "flex";
});

closeprofile.addEventListener("click", function () {
  Overlay.style.display = "none";
});

//profilecode
submitbutton.addEventListener("click", CreateProfile);
let persondetails = JSON.parse(localStorage.getItem("persondetails")) || [];
let lastprofile = null;
function CreateProfile() {
  let name = profilename.value.trim();
  let image = profileimage.value.trim();

  if (name === "" || image === "") {
    alert("Please enter all values");
    return;
  }

  let obj = {
    name: name,
    image: image,
  };

  persondetails.push(obj);
  lastprofile = obj;
  localStorage.setItem("persondetails", JSON.stringify(persondetails));

  displaysecondname.textContent = `${lastprofile.name}👋`;
  displayname.textContent = lastprofile.name;
  displayimage.src = lastprofile.image;
  Overlay.style.display = "none";
}

let savedprofile = persondetails;

if (savedprofile.length > 0) {
  lastprofile = savedprofile[savedprofile.length - 1];
  displaysecondname.textContent = `${lastprofile.name}👋`;
  displayname.textContent = lastprofile.name;
  displayimage.src = lastprofile.image;
}

let form1 = document.querySelector(".Transaction-form");
let income = document.querySelector("#income-transaction");
let expenses = document.querySelector("#expenses-transaction");
let Description = document.querySelector("#description");
let Amount = document.querySelector("#amount");
let Category = document.querySelector("#category");
let Dateinput = document.querySelector("#date");

let showbalance = document.querySelector("#Balance");
let showIncome = document.querySelector("#Total");
let shoexpenses = document.querySelector("#Expenses");

let incomedata = JSON.parse(localStorage.getItem("incomedata")) || [];
let expensesdata = JSON.parse(localStorage.getItem("expensesdata")) || [];
let transactiontype = "income";

income.addEventListener("click", function () {
  income.classList.add("active-in");
  expenses.classList.remove("active-exp");
  transactiontype = "income";
});

expenses.addEventListener("click", function () {
  expenses.classList.add("active-exp");
  income.classList.remove("active-in");
  transactiontype = "expenses";
});

form1.addEventListener("submit", function (e) {
  e.preventDefault();

  let Descriptionf = Description.value.trim();
  let Amountf = Amount.value.trim();
  let Datef = Dateinput.value.trim();
  let Categoryf = Category.value.trim();

  if (!Descriptionf || !Amountf || !Datef || !Categoryf) {
    alert("Please fill all the fields");
    return;
  }

  let moneydata = {
    id: Date.now(),
    description: Descriptionf,
    amount: Number(Amountf),
    date: Datef,
    category: Categoryf,
    type: transactiontype,
  };

  if (moneydata.type === "income") {
    incomedata.push(moneydata);
    localStorage.setItem("incomedata", JSON.stringify(incomedata));
  } else {
    expensesdata.push(moneydata);
    localStorage.setItem("expensesdata", JSON.stringify(expensesdata));
  }

  form1.reset();
  Renderdata();
  CreateTable();
  Creategraph()
});

//cards data on the dynamic

let Card = document.querySelectorAll(".Card");

function Renderdata() {
  let totalincome = incomedata.reduce(function (acc, value) {
    return acc + Number(value.amount);
  }, 0);

  let totalexpnese = expensesdata.reduce(function (acc, value) {
    return acc + Number(value.amount);
  }, 0);

  let balance = totalincome - totalexpnese;
  let balanceinpercentage = totalincome > 0 ? (balance / totalincome) * 100 : 0;
  let expensesinpercentage =
    totalincome > 0 ? (totalexpnese / totalincome) * 100 : 0;

  document.querySelector("#Balance").textContent = balance;
  document.querySelector("#Current-balance-data").textContent =
    balanceinpercentage.toFixed(1) + "%";
  document.querySelector("#Total").textContent = totalincome;
  document.querySelector("#Income-data").textContent = "100%";
  document.querySelector("#Expenses").textContent = totalexpnese.toFixed(1);
  document.querySelector("#Total-Expenses-data").textContent =
    expensesinpercentage.toFixed(2) + "%";
  document.querySelector("#Saving").textContent =
    balanceinpercentage.toFixed(1) + "% ";
  document.querySelector("#Saving-rate-data").textContent = "0.0%";
}

/// add table data dynamically
let tablebody = document.querySelector("#transaction-list");

function CreateTable() {
  let categoryIcons = [
    {
      category: "Freelance",
      icon: "ri-briefcase-line",
      color: "#7045d6",
    },
    {
      category: "Groceries",
      icon: "ri-restaurant-2-line",
      color: "#a83e52",
    },
    {
      category: "Electricity Bill",
      icon: "ri-flashlight-line",
      color: "#e5a323",
    },
    {
      category: "Salary",
      icon: "ri-money-rupee-circle-line",
      color: "#079b79",
    },
    {
      category: "Online Shopping",
      icon: "ri-shopping-bag-3-line",
      color: "#7845d4",
    },
    {
      category: "Transport",
      icon: "ri-bus-line",
      color: "#1689db",
    },
    {
      category: "Entertainment",
      icon: "ri-gamepad-line",
      color: "#079b91",
    },
  ];

  tablebody.innerHTML = "";
  let alltransaction = [...incomedata, ...expensesdata].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );

  alltransaction.forEach((transaction) => {
    let amountclass =
      transaction.type === "income" ? "income-style" : "expenses-style";
    let sign = transaction.type === "income" ? "+" : "-";

    let categorydata = categoryIcons.find((item) => {
      return item.category === transaction.category;
    }) || {
      icon: "ri-price-tag-3-line",
      color: "#888888",
    };

    let iconhtml = `
<span style = "background-color:${categorydata.color}">
<i class="${categorydata.icon}"></i>
</span>`;

    let row = document.createElement("tr");
    row.innerHTML = `
    <td>${transaction.date}</td>
    <td>${transaction.description}</td>
    <td>${iconhtml}${transaction.category}</td>
    <td>${transaction.type}</td>
   <td class="${amountclass}">${sign} ₹${transaction.amount}</td>
    `;
    tablebody.appendChild(row);
  });
}



//graph and table data

let cashflowChart = null;

function Creategraph() {

  let alltransaction = [...incomedata,...expensesdata]

  let monthlydata = {}

  alltransaction.forEach(transaction => {

    let date = transaction.date;
    let month = date.slice(0,7)
    
    if (!monthlydata[month]) {
      monthlydata[month]={
        income: 0,
        expenses:0,
      }
    }


    if (transaction.type === "income") {
      monthlydata[month].income += Number(transaction.amount)
    }else if(transaction.type === "expenses"){
      monthlydata[month].expenses += Number(transaction.amount)
    }
  });

  let sortedMonths = Object.keys(monthlydata).sort()

    let labels = sortedMonths.map((month) => {
    let [year, monthNumber] = month.split("-");
    return new Date(Number(year), Number(monthNumber) - 1)
      .toLocaleString("en-US", { month: "short", year: "numeric" });
  });


  let incomevalues = sortedMonths.map((month)=>
  monthlydata[month].income 
  )

   let expensesvalue = sortedMonths.map((month)=>
  monthlydata[month].expenses 
  )

  let ctx = document.querySelector("#cashflowChart");
  if (cashflowChart) {
    cashflowChart.data.labels = labels;
    cashflowChart.data.datasets[0].data = incomevalues;
    cashflowChart.data.datasets[1].data = expensesvalue;

    cashflowChart.update();
  } else {

    cashflowChart = new Chart(ctx, {
      type: "bar",

      data: {
        labels: labels,

        datasets: [
          {
            label: "Income",
            data: incomevalues,
            backgroundColor: "#22c55e",
            borderRadius: 4
          },
          {
            label: "Expenses",
            data: expensesvalue,
            backgroundColor: "#ef4444",
            borderRadius: 4
          }
        ]
      },

      options: {
        responsive: true,
        maintainAspectRatio: false,

        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

  }

}

Renderdata();
CreateTable();
Creategraph();