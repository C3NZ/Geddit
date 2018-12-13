$(document).ready(function() {
    $('.vote-up').submit(function(e) {
        e.preventDefault();

        const postId = $(this).data('id');

        $.ajax({
            type: 'PUT',
            url: `/posts/${postId}/vote-up`,
            success: function (data) {
                console.log('successfully voted up')
            },
            error: function (err) {
                console.error(err);
            }
        });
    });

    $('.vote-down').submit(function(e) {
        e.preventDefault();

        const postId = $(this).data('id');
        
        $.ajax({
            type: 'PUT',
            url: `/posts/${postId}/vote-down`,
            success: function (data) {
                console.log('successfully voted down')
            },
            error: function (err) {
                console.error(err);
            }
        });

       
    })


})
