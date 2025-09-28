$(document).ready(function() {
    // Autocomplete setup
    $("#ingredients").autocomplete({
        source: function(request, response) {
            $.ajax({
                url: "/api/ingredients",
                type: "GET",
                dataType: "json",
                success: function(data) {
                    var filtered = $.grep(data, function(item) {
                        return item.toLowerCase().startsWith(request.term.toLowerCase());
                    });
                    response(filtered);
                },
                error: function() {
                    response([]);
                }
            });
        },
        minLength: 1,
        select: function(event, ui) {
            var terms = this.value.split(/,\s*/);
            terms.pop();
            terms.push(ui.item.value);
            terms.push("");
            this.value = terms.join(", ");
            return false;
        }
    });

    // Smooth scrolling
    $('a[href^="#"]').on('click', function(event) {
        var target = this.hash;
        if (target) {
            event.preventDefault();
            $('html, body').animate({
                scrollTop: $(target).offset().top
            }, 800, function(){
                window.location.hash = target;
            });
        }
    });

    // Recipe form submission
    $("#recipe-form").on("submit", function(e) {
        e.preventDefault();
        $.ajax({
            url: "/generate_recipe",
            type: "POST",
            data: $(this).serialize(),
            success: function(response) {
                $("#recipe-result").html(
                    `
                    <div class="ingredients-wrapper">
                        <div class="ingredients">
                            <h3>Ingredients</h3>
                            <ul>
                                ${response.ingredients.map(item => `<li>${item}</li>`).join("")}
                            </ul>
                        </div>
                        <div class="recipe-image">
                            <img src="/static/r.jpg" alt="Recipe Image">
                        </div>
                    </div>
                    <div class="instructions">
                        <h3>Instructions</h3>
                        <p>${response.instructions}</p>
                    </div>
                    `
                );
                $("html, body").animate({ scrollTop: $("#recipe-result").offset().top }, 600);
            },
            error: function() {
                $("#recipe-result").html("<p>⚠️ Something went wrong. Please try again.</p>");
            }
        });
    });
});
