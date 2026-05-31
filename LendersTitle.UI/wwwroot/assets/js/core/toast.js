function showToast(message, type) {
    const bgClass = {
        success: "bg-success-toast text-success-toast",
        error: "bg-danger-toast text-danger-toast",
        warning: "bg-warning-toast text-warning-toast",
        info: "bg-info-toast text-info-toast"
    }[type] || "bg-secondary text-white";

    const toastId = "toast_" + Date.now();
    const delay = 5000;

    const toastHtml = `
        <div id="${toastId}" class="toast align-items-center ${bgClass} mb-2" data-type="${type}" role="alert" aria-live="assertive" aria-atomic="true" data-autohide="true">
            <div class="d-flex flex-row">
                <button class="btn btn-sm m-0 me-1 pin-btn py-0 shadow-0" data-pinned="false" title="Pin notification">
                    <i class="fa-regular fa-bookmark"></i>
                </button>
                <button class="btn btn-sm m-0 me-1 copy-btn py-0 shadow-0" title="Copy message">
                    <i class="fa-regular fa-copy"></i>
                </button>
                <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="d-flex">
                <div class="toast-body flex-grow-1">${message}</div>                
            </div>
            <div class="progress toast-progress" style="height: 7px; background: #00000075;">
                <div class="progress-bar ${bgClass}" style="width: 100%;"></div>
            </div>
        </div>
    `;

    $('#toastContainer').append(toastHtml);

    const $toast = $('#' + toastId);
    const $progressBar = $toast.find('.progress-bar');
    const $pinBtn = $toast.find('.pin-btn');
    const $copyBtn = $toast.find('.copy-btn');
    let pinned = false;

    const toast = new bootstrap.Toast($toast[0], { delay: delay });

    // Animate progress bar after DOM is rendered
    setTimeout(() => {
        if (!pinned) {
            $progressBar.css({
                transition: `width ${delay}ms linear`,
                width: '0%'
            });
        }
    }, 100); // small delay to ensure styles apply

    // Pin button toggle
    $pinBtn.on('click', function () {
        pinned = !pinned;
        $(this).attr('data-pinned', pinned);
        if (pinned) {
            toast._config.autohide = false;
            $(this).html("<i class='fa-solid fa-bookmark'></i>");
            $progressBar.stop().css('width', '100%');
        } else {
            toast._config.autohide = true;
            $(this).html("<i class='fa-regular fa-bookmark'></i>");
            // resume shrinking
            $progressBar.css('transition', 'width 2s linear');
            $progressBar.css('width', '0%');
            toast.hide(); // retrigger hiding
        }
    });

    $copyBtn.on('click', function () {
        const textToCopy = $toast.find('.toast-body').text().trim();
        navigator.clipboard.writeText(textToCopy).then(() => {
            // feedback (change icon briefly)
            const $icon = $(this).find("i");
            $icon.removeClass("fa-regular fa-copy").addClass("fa-solid fa-check");
            setTimeout(() => {
                $icon.removeClass("fa-solid fa-check").addClass("fa-regular fa-copy");
            }, 1500);
        });
    });

    // Auto remove toast from DOM after hidden
    $toast.on('hidden.bs.toast', function () {
        $(this).remove();
    });

    toast.show();
}