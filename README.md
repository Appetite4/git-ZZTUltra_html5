# git-ZZTUltra_html5
ZZT Ultra 1.3, HTML 5 version.

This version of ZZT Ultra is a mostly-complete port of the AS3 version.

For this reason, not all functionality will work as expected.  Specifically:

. Some layers may have shearing errors during drawing, particularly scroll interfaces.
. High score support is broken.
. Incomplete ZIP support.  Only ZZT, SZT, and WAD files should work perfectly.
. Minor rounding issues occur with some floating-point calculations.
. Ability to load and save disk files is clunky due to web browser security restrictions.

If you are testing this platform from a local disk file source, you must place the browser
in a special "local only" mode in order to satisfy the CORS policy.  For example, for
Chrome, the command-line option is "--allow-file-access-from-files".
