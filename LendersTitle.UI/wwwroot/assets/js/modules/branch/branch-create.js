;(function ($) {
    'use strict';

    var BranchCreate = {
        $modal: null,
        $form: null,
        $submitBtn: null,
        $formBody: null,

        init: function () {
            this.$modal    = $('#createModal');
            this.$form     = $('#createBranchForm');
            this.$submitBtn = $('#createBranchSubmit');
            this.$formBody = $('#createFormBody');

            if (!this.$modal.length) return;

            this._bindSubmit();
            this._bindReset();
        },

        _bindSubmit: function () {
            var self = this;

            this.$form.on('submit', function (e) {
                e.preventDefault();

                if (!self.$form.valid()) return;

                self.$submitBtn.prop('disabled', true);
                self.$submitBtn.html('<span class="spinner-border spinner-border-sm" role="status"></span> Saving...');

                $.ajax({
                    type: 'POST',
                    url: self.$form.attr('action'),
                    data: self.$form.serialize(),
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    success: function (response) {
                        if (response.success) {
                            self.$modal.modal('hide');
                            location.reload();
                        } else {
                            self.$formBody.html(response);
                            self._reinitValidation();
                        }
                    },
                    error: function () {
                        self.$formBody.html(
                            '<div class="alert alert-danger mb-0">An error occurred. Please try again.</div>'
                        );
                    },
                    complete: function () {
                        self.$submitBtn.prop('disabled', false);
                        self.$submitBtn.html('<i class="fa-regular fa-floppy-disk me-1"></i>Save');
                    }
                });
            });
        },

        _bindReset: function () {
            var self = this;

            this.$modal.on('hidden.bs.modal', function () {
                self.$form.trigger('reset');
                self.$form.find('.is-invalid').removeClass('is-invalid');
                self.$form.find('.is-valid').removeClass('is-valid');
                self.$form.find('.text-danger').empty();
                self.$form.find('.field-validation-error').remove();
            });
        },

        _reinitValidation: function () {
            var $form = this.$form;
            $form.removeData('validator');
            $form.removeData('unobtrusiveValidation');
            $.validator.unobtrusive.parse($form);
        }
    };

    $(document).ready(function () {
        BranchCreate.init();
    });

})(window.jQuery);
