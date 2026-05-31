(function ($) {
    'use strict';

    var $search = null;
    var $filter = null;
    var $table = null;
    var $rows = null;
    var searchTimer = null;

    /* ── TempData Toast ── */

    function showTempDataToast() {
        $('#tempDataToast, #tempDataErrorToast').each(function () {
            var $el = $(this);
            var message = $el.data('message');
            var type = $el.data('type');
            if (message) {
                showToast(message, type);
            }
        });
    }

    /* ── Filtering ── */

    function filterRows() {
        var query = ($search.val() || '').toLowerCase().trim();
        var status = $filter.val();

        $rows.each(function () {
            var $row = $(this);
            var name = ($row.data('name') || '').toLowerCase();
            var rowStatus = $row.data('status');
            var match = true;

            if (query && name.indexOf(query) === -1) {
                match = false;
            }
            if (status !== 'all' && rowStatus !== status) {
                match = false;
            }
            $row.toggle(match);
        });

        updateEmptyState();
    }

    function updateEmptyState() {
        var visible = $rows.filter(':visible').length;
        var $info = $('.table-pagination__info');
        var $empty = $('.branch-index .table-enterprise__empty-row');

        if (visible === 0) {
            if (!$empty.length) {
                var colspan = $table.find('thead th').length;
                var msg = 'No branches match your search criteria.';
                var html = '<tr class="table-enterprise__empty-row">'
                    + '<td class="table-enterprise__empty" colspan="' + colspan + '">'
                    + '<div class="table-enterprise__empty-icon"><i class="fa-regular fa-search"></i></div>'
                    + '<div class="table-enterprise__empty-title">No results found</div>'
                    + '<div class="table-enterprise__empty-description">' + msg + '</div>'
                    + '</td></tr>';
                $empty = $(html);
                $('#branch-table-body').append($empty);
            }
            $empty.show();
            if ($info.length) $info.hide();
        } else {
            if ($empty.length) $empty.hide();
            if ($info.length) $info.show();
        }
    }

    /* ── Delete via AJAX ── */

    function submitDelete(e) {
        e.preventDefault();

        var $form = $(this);
        var action = $form.attr('action');
        var formData = $form.serialize();

        $.ajax({
            type: 'POST',
            url: action,
            data: formData,
            headers: { 'X-Requested-With': 'XMLHttpRequest' },
            success: function (response) {
                var modalEl = document.getElementById('deleteModal');
                var modal = bootstrap.Modal.getInstance(modalEl);
                if (modal) modal.hide();

                if (response.success) {
                    showToast(response.message || 'Branch deleted successfully.','success');

                    var $row = $('.btn-delete-branch[data-branch-id="' + response.id + '"]').closest('.branch-row');
                    $row.fadeOut(300, function () { $row.remove(); filterRows(); });
                } else {
                    showError(response.message || 'Failed to delete branch.');
                }
            },
            error: function () {
                showError('An error occurred while deleting the branch.');
            }
        });
    }

    function bindDelete() {
        $(document).on('click', '.btn-delete-branch', function () {
            var id = $(this).data('branch-id');
            var name = $(this).data('branch-name');
            $('#delete-branch-id').val(id);
            $('#delete-branch-name').text(name);
            var modalEl = document.getElementById('deleteModal');
            var modal = new bootstrap.Modal(modalEl);
            modal.show();
        });

        $('#deleteModal form').on('submit', submitDelete);
    }

    /* ── Search ── */

    function bindSearch() {
        $search.on('input', function () {
            clearTimeout(searchTimer);
            searchTimer = setTimeout(filterRows, 250);
        });
    }

    /* ── Status filter ── */

    function bindFilter() {
        $filter.on('change', filterRows);
    }

    /* ── Refresh ── */

    function bindRefresh() {
        $('.table-toolbar__actions .btn-outline-secondary').on('click', function () {
            var $btn = $(this);
            $btn.prop('disabled', true);
            $btn.html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>');
            setTimeout(function () { location.reload(); }, 350);
        });
    }

    /* ── Init ── */

    function init() {
        $search = $('.branch-search');
        $filter = $('.status-filter');
        $table = $('#branch-table');
        $rows = $('#branch-table-body .branch-row');

        showTempDataToast();
        bindSearch();
        bindFilter();
        bindDelete();
        bindRefresh();
    }

    $(document).ready(init);

})(jQuery);
