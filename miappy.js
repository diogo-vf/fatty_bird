// Background scrolling speed
let move_speed = 3;

// Gravity constant value
let gravity = 0.5;

// Getting reference to the bird element
let bird = document.querySelector('.bird');

// Getting bird element properties
let bird_props = bird.getBoundingClientRect();
let background = document.querySelector('.background').getBoundingClientRect();

// Getting reference to the score element
let score_val = document.querySelector('.score_val');
let message_tag = document.querySelector('.message');
let score_title = document.querySelector('.score_title');

// Setting initial game state to start
let game_state = 'End';
setMessage('Press Enter To Start The Game');

document.addEventListener('keydown', (e) => {
    // Start the game if enter key is pressed
    if (e.key == 'Enter' && game_state != 'Play') {
        document.querySelectorAll('.pipe_sprite').forEach((element) => {
            element.remove();
        });
        bird.style.top = '40vh';
        game_state = 'Play';
        setMessage('');
        score_title.innerHTML = 'Score : ';
        score_val.innerHTML = '0';
        play();
    }
});

function setMessage(message){
    message_tag.innerHTML = message
    message_tag.style.left = '28vw';
}

function play() {
    function move() {

        // Detect if game has ended
        if (game_state != 'Play') return;

        // Getting reference to all the pipe elements
        let pipe_sprite = document.querySelectorAll('.pipe_sprite');
        pipe_sprite.forEach((element) => {

            let pipe_sprite_props = element.getBoundingClientRect();
            bird_props = bird.getBoundingClientRect();

            // Delete the pipes if they have moved out
            // of the screen hence saving memory
            if (pipe_sprite_props.right <= 0) {
                element.remove();
            } else {
                // Collision detection with bird and pipes
                if (
                    bird_props.left < pipe_sprite_props.left + pipe_sprite_props.width &&
                    bird_props.left + bird_props.width > pipe_sprite_props.left &&
                    bird_props.top < pipe_sprite_props.top + pipe_sprite_props.height &&
                    bird_props.top + bird_props.height > pipe_sprite_props.top
                ) {

                    // Change game state and end the game
                    // if collision occurs
                    game_state = 'End';
                    setMessage(`You lose... Try to do better than ${score_val.innerHTML}`);
                    return;
                } else {
                    // Increase the score if player
                    // has the successfully dodged the 
                    if (
                        pipe_sprite_props.right < bird_props.left &&
                        pipe_sprite_props.right +
                        move_speed >= bird_props.left &&
                        element.increase_score == '1'
                    ) {
                        score_val.innerHTML = +score_val.innerHTML + 1;
                    }
                    element.style.left =
                        pipe_sprite_props.left - move_speed + 'px';
                }
            }
        });

        requestAnimationFrame(move);
    }
    requestAnimationFrame(move);

    let bird_dy = 0;
    function apply_gravity() {
        if (game_state != 'Play') return;
        bird_dy = bird_dy + gravity;
        document.addEventListener('keydown', (e) => {
            if (e.key == 'ArrowUp' || e.key == ' ') {
                bird_dy = -7.6;
            }
        });

        // Collision detection with bird and
        // window top and bottom

        if (bird_props.top <= 0 ||
            bird_props.bottom >= background.bottom) {
            game_state = 'End';
            setMessage('Press Enter To Restart');
            return;
        }
        bird.style.top = bird_props.top + bird_dy + 'px';
        bird_props = bird.getBoundingClientRect();
        requestAnimationFrame(apply_gravity);
    }
    requestAnimationFrame(apply_gravity);

    let pipe_seperation = 0;

    // Constant value for the gap between two pipes
    let pipe_gap = 45;
    function create_pipe() {
        if (game_state != 'Play') return;

        // Create another set of pipes
        // if distance between two pipe has exceeded
        // a predefined value
        if (pipe_seperation > 115) {
            pipe_seperation = 0

            // Calculate random position of pipes on y axis
            let pipe_posi = Math.floor(Math.random() * 43) + 8;
            let pipe_top = document.createElement('div');
            pipe_top.className = 'pipe_sprite';
            pipe_top.style.top = pipe_posi - 70 + 'vh';
            pipe_top.style.left = '100vw';

            let pipe_top_cover = document.createElement('div');
            pipe_top_cover.className = 'pipe_sprite_top_cover';


            let pipe_sprite = pipe_top.cloneNode(true);
            pipe_sprite.style.top = pipe_posi + pipe_gap + 'vh';
            pipe_sprite.increase_score = '1';

            let pipe_bottom_cover = document.createElement('div');
            pipe_bottom_cover.className = 'pipe_sprite_bottom_cover';

            // Append the created pipe element in DOM
            pipe_top.appendChild(pipe_top_cover);
            document.body.appendChild(pipe_top);

            // Append the created pipe element in DOM
            pipe_sprite.appendChild(pipe_bottom_cover);
            document.body.appendChild(pipe_sprite);
        }
        pipe_seperation++;
        requestAnimationFrame(create_pipe);
    }
    requestAnimationFrame(create_pipe);
}