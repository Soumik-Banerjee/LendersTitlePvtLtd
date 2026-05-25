;(function (document) {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {

        /* ------------------------------------------------------------------
           PROFILE DROPDOWN TOGGLE
           ------------------------------------------------------------------ */
        var profile = document.querySelector('.navbar-top__profile');
        var dropdown = document.querySelector('.navbar-top__profile-dropdown');

        if (profile && dropdown) {
            profile.addEventListener('click', function (e) {
                e.stopPropagation();
                dropdown.classList.toggle('open');
            });

            document.addEventListener('click', function () {
                dropdown.classList.remove('open');
            });

            dropdown.addEventListener('click', function (e) {
                e.stopPropagation();
            });
        }

    });

})(document);
