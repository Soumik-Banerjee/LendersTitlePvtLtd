(function ($) {
    'use strict';

    var table = null;

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

    /* ── Status Filter ── */

    $.fn.dataTable.ext.search.push(function (settings, data) {
        var status = $('#statusFilter').val();
        if (!status) return true;
        return data[2] === status;
    });

    /* ── DataTable ── */

    function initTable() {
        table = $('#branch-table').DataTable({
            ajax: {
                url: '/BranchMaster/GetBranchesJson',
                type: 'GET',
                dataSrc: 'data'
            },
            columns: [
                {
                    data: null,
                    className: 'text-muted ps-3',
                    render: function (data, type, row, meta) {
                        return meta.row + 1;
                    }
                },
                {
                    data: 'branchName',
                    render: function (data) {
                        return '<div class="d-flex flex-column"><span class="fw-medium">' + $('<span>').text(data).html() + '</span></div>';
                    }
                },
                {
                    data: 'isActive',
                    className: '',
                    render: function (data) {
                        var active = data === true || data === 'True';
                        var cls = active ? 'bg-success-subtle text-success-emphasis' : 'bg-secondary-subtle text-secondary-emphasis';
                        var label = active ? 'Active' : 'Inactive';
                        return '<span data-status="' + data + '" class="badge ' + cls + ' rounded-pill px-3 py-1"><i class="fa-solid fa-circle me-1" style="font-size: 0.5rem;"></i>' + label + '</span>';
                    }
                },
                {
                    data: null,
                    className: 'text-end pe-3',
                    orderable: false,
                    render: function (data) {
                        var id = data.id;
                        var name = $('<span>').text(data.branchName).html();
                        return '<a href="/BranchMaster/Edit/' + id + '" class="btn btn-sm btn-outline-primary me-1" title="Edit"><i class="fa-regular fa-pen-to-square"></i></a>'
                            + '<button type="button" class="btn btn-sm btn-outline-danger btn-delete-branch" data-branch-id="' + id + '" data-branch-name="' + name + '" title="Delete"><i class="fa-regular fa-trash-can"></i></button>';
                    }
                }
            ],
            processing: true,
            responsive: true,
            stateSave: true,
            autoWidth: false,
            language: {
                emptyTable: '<div class="py-4"><div class="mb-2 text-muted"><i class="fa-regular fa-building fs-1"></i></div><h5>No branches yet</h5><p class="text-muted mb-0">Get started by creating your first branch.</p></div>',
                zeroRecords: '<div class="py-4"><div class="mb-2 text-muted"><i class="fa-regular fa-search fs-1"></i></div><h5>No results found</h5><p class="text-muted mb-0">No branches match your search criteria.</p></div>',
                search: '',
                searchPlaceholder: 'Search...',
                info: 'Showing _START_ to _END_ of _TOTAL_ branches',
                infoEmpty: 'Showing 0 branches',
                infoFiltered: '(filtered from _MAX_ total branches)'
            },
            dom: '<"d-none"f>t<"d-flex flex-wrap align-items-center justify-content-between gap-2 p-3 bg-body-tertiary border-top rounded-bottom"ip>'
        });
    }

    /* ── Search ── */

    function bindSearch() {
        $('#branchSearch').on('keyup', function () {
            table.search(this.value).draw();
        });
    }

    /* ── Status Filter ── */

    function bindFilter() {
        $('#statusFilter').on('change', function () {
            table.draw();
        });
    }

    /* ── Refresh ── */

    function bindRefresh() {
        $('#refreshBtn').on('click', function () {
            var $btn = $(this);
            $btn.prop('disabled', true);
            $btn.html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>');
            table.ajax.reload(function () {
                $btn.prop('disabled', false);
                $btn.html('<i class="fa-solid fa-rotate"></i>');
            }, false);
        });
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
                    showToast(response.message || 'Branch deleted successfully.', 'success');
                    table.ajax.reload(null, false);
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

    /* ── Init ── */

    function init() {
        showTempDataToast();
        initTable();
        bindSearch();
        bindFilter();
        bindRefresh();
        bindDelete();
    }

    $(document).ready(init);

})(jQuery);
