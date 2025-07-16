//  Custom JavaScript for tab navigation 
document.addEventListener('DOMContentLoaded', function () {
    // Handle next tab button clicks
    document.querySelectorAll('.next-tab').forEach(button => {
        button.addEventListener('click', function () {
            const nextTabId = this.getAttribute('data-next-tab');
            const nextTab = document.querySelector(`#${nextTabId}`);
            const tabInstance = new bootstrap.Tab(nextTab);
            tabInstance.show();
        });
    });

    // Handle previous tab button clicks
    document.querySelectorAll('.prev-tab').forEach(button => {
        button.addEventListener('click', function () {
            const prevTabId = this.getAttribute('data-prev-tab');
            const prevTab = document.querySelector(`#${prevTabId}`);
            const tabInstance = new bootstrap.Tab(prevTab);
            tabInstance.show();
        });
    });
});
