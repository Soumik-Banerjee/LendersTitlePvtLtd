(function ($) {
    'use strict';

    var $modal = null;
    var $form = null;
    var $submitBtn = null;
    var $formBody = null;

    function getFormData() {
        return $form.serialize();
    }

    function getActionUrl() {
        return $form.attr('action');
    }

    function setLoading(loading) {
        $submitBtn.prop('disabled', loading);
        $submitBtn.html(loading
            ? '<span class="spinner-border spinner-border-sm" role="status"></span> Saving...'
            : '<i class="fa-regular fa-floppy-disk me-1"></i>Save');
    }

    function showError(message) {
        $formBody.html('<div class="alert alert-danger mb-0">' + message + '</div>');
    }

    function reinitValidation() {
        $form.removeData('validator');
        $form.removeData('unobtrusiveValidation');
        $.validator.unobtrusive.parse($form);
    }

    function resetForm() {
        $form.trigger('reset');
        $form.find('.is-invalid').removeClass('is-invalid');
        $form.find('.is-valid').removeClass('is-valid');
        $form.find('.text-danger').empty();
        $form.find('.field-validation-error').remove();
    }

    function handleSuccess(response) {
        if (response.success) {
            $modal.modal('hide');
            showToast(response.message || 'Branch created successfully.','success');
            setTimeout(function () { location.reload(); }, 1500);
        } else {
            $formBody.html(response);
            reinitValidation();
        }
    }

    function handleError() {
        showError('An error occurred. Please try again.');
    }

    function handleComplete() {
        setLoading(false);
    }

    function submitForm(e) {
        e.preventDefault();
        if (!$form.valid()) return;

        setLoading(true);

        $.ajax({
            type: 'POST',
            url: getActionUrl(),
            data: getFormData(),
            headers: { 'X-Requested-With': 'XMLHttpRequest' },
            success: handleSuccess,
            error: handleError,
            complete: handleComplete
        });
    }

    function bindSubmit() {
        $form.on('submit', submitForm);
    }

    function bindReset() {
        $modal.on('hidden.bs.modal', resetForm);
    }

    function init() {
        $modal = $('#createModal');
        $form = $('#createBranchForm');
        $submitBtn = $('#createBranchSubmit');
        $formBody = $('#createFormBody');

        if (!$modal.length) return;

        bindSubmit();
        bindReset();
    }

    $(document).ready(init);

})(jQuery);
