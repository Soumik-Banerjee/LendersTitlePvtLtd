;(function ($) {
    'use strict';

    var BranchIndex = {
        $search: null,
        $filter: null,
        $table: null,
        $rows: null,
        searchTimer: null,

        init: function () {
            this.$search  = $('.branch-search');
            this.$filter  = $('.status-filter');
            this.$table   = $('#branch-table');
            this.$rows    = $('#branch-table-body .branch-row');

            this._bindSearch();
            this._bindFilter();
            this._bindDelete();
            this._bindRefresh();
        },

        _filterRows: function () {
            var query  = (this.$search.val() || '').toLowerCase().trim();
            var status = this.$filter.val();

            this.$rows.each(function () {
                var $row   = $(this);
                var name   = ($row.data('name') || '').toLowerCase();
                var rowStatus = $row.data('status');
                var match  = true;

                if (query && name.indexOf(query) === -1) {
                    match = false;
                }

                if (status !== 'all' && rowStatus !== status) {
                    match = false;
                }

                $row.toggle(match);
            });

            this._updateEmptyState();
        },

        _updateEmptyState: function () {
            var visible = this.$rows.filter(':visible').length;
            var $info   = $('.table-pagination__info');
            var $empty  = $('.branch-index .table-enterprise__empty-row');

            if (visible === 0) {
                if (!$empty.length) {
                    var colspan = this.$table.find('thead th').length;
                    var msg = 'No branches match your search criteria.';
                    $empty = $('<tr class="table-enterprise__empty-row"><td class="table-enterprise__empty" colspan="' + colspan + '"><div class="table-enterprise__empty-icon"><i class="fa-regular fa-search"></i></div><div class="table-enterprise__empty-title">No results found</div><div class="table-enterprise__empty-description">' + msg + '</div></td></tr>');
                    $('#branch-table-body').append($empty);
                }
                $empty.show();
                if ($info.length) $info.hide();
            } else {
                if ($empty.length) $empty.hide();
                if ($info.length) $info.show();
            }
        },

        _bindSearch: function () {
            var self = this;
            this.$search.on('input', function () {
                clearTimeout(self.searchTimer);
                self.searchTimer = setTimeout(function () {
                    self._filterRows();
                }, 250);
            });
        },

        _bindFilter: function () {
            var self = this;
            this.$filter.on('change', function () {
                self._filterRows();
            });
        },

        _bindDelete: function () {
            var self = this;
            $(document).on('click', '.btn-delete-branch', function () {
                var id   = $(this).data('branch-id');
                var name = $(this).data('branch-name');
                $('#delete-branch-id').val(id);
                $('#delete-branch-name').text(name);
                var modalEl = document.getElementById('deleteModal');
                var modal = new bootstrap.Modal(modalEl);
                modal.show();
            });
        },

        _bindRefresh: function () {
            var self = this;
            $('.table-toolbar__actions .btn-outline-secondary').on('click', function () {
                var $btn = $(this);
                $btn.prop('disabled', true);
                $btn.html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>');
                setTimeout(function () {
                    location.reload();
                }, 350);
            });
        }
    };

    $(document).ready(function () {
        BranchIndex.init();
    });

})(window.jQuery);
