document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const assetInput = document.querySelector('.Input-text[placeholder="Assest Name"]');
    const amountInput = document.querySelector('.Input-text[placeholder="Amoutn invested"]');
    const currentValueInput = document.querySelector('.Input-text[placeholder="Current"]');
    const addBtn = document.getElementById('Btn-btn');
    const totalValueElem = document.getElementById('para');
    const listElem = document.getElementById('list');

    let investments = JSON.parse(localStorage.getItem('investments')) || [];

    // Initialize dashboard
    function updateDashboard() {
        // Clear the current list
        listElem.innerHTML = '';

        // Add the header
        const header = document.createElement('div');
        header.id = 'lst-ul-header';
        header.innerHTML = `
            <div>Assest Name</div>
            <div>Amount Invested</div>
            <div>Current</div>
            <div>% Change</div>
            <div>Action</div>
        `;
        listElem.appendChild(header);

        let totalValue = 0;

        investments.forEach((investment, index) => {
            const percentageChange = ((investment.currentValue - investment.amountInvested) / investment.amountInvested) * 100;
            totalValue += investment.currentValue;

            const listItem = document.createElement('div');
            listItem.className = 'list-item';
            listItem.innerHTML = `
                <div>${investment.assetName}</div>
                <div>$${investment.amountInvested.toFixed(2)}</div>
                <div>$${investment.currentValue.toFixed(2)}</div>
                <div>${percentageChange.toFixed(2)}%</div>
                <div><button onclick="removeInvestment(${index})">Remove</button></div>
            `;
            listElem.appendChild(listItem);
        });

        // Update the total portfolio value
        totalValueElem.innerText = `Total Portfolio Value: $${totalValue.toFixed(2)}`;
        updateChart();
    }

    // Load dashboard
    updateDashboard();

    // Add new investment
    addBtn.addEventListener('click', () => {
        const assetName = assetInput.value;
        const amountInvested = parseFloat(amountInput.value);
        const currentValue = parseFloat(currentValueInput.value);

        if (!assetName || isNaN(amountInvested) || isNaN(currentValue)) {
            alert('Please fill in all fields with valid data');
            return;
        }

        const newInvestment = { assetName, amountInvested, currentValue };
        investments.push(newInvestment);
        localStorage.setItem('investments', JSON.stringify(investments));
        updateDashboard();

        // Clear input fields
        assetInput.value = '';
        amountInput.value = '';
        currentValueInput.value = '';
    });

    // Remove an investment
    window.removeInvestment = (index) => {
        investments.splice(index, 1);
        localStorage.setItem('investments', JSON.stringify(investments));
        updateDashboard();
    };

    // Update the chart (if applicable, assuming Chart.js)
    function updateChart() {
        const ctx = document.getElementById('canva').getContext('2d');
        const assetNames = investments.map(i => i.assetName);
        const assetValues = investments.map(i => i.currentValue);

        if (window.portfolioChart) {
            window.portfolioChart.destroy();
        }

        window.portfolioChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: assetNames,
                datasets: [{
                    label: 'Portfolio Distribution',
                    data: assetValues,
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
                }]
            },
            options: {
                responsive: true
            }
        });
    }
});
