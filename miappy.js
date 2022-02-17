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
setMessage('Press Space To Start The Game');

function startNewGame(){
    let initial_score = 0
        document.querySelectorAll('.pipe_sprite').forEach((element) => {
            element.remove();
        });
        bird.style.top = '40vh';
        game_state = 'Play';
        score_title.innerHTML = 'Score : ';
        setMessage('');
        setScore(initial_score)
        play(initial_score);
}

function setScore(value) {
    score_val.innerHTML = value;
}

function setMessage(value) {
    message_tag.innerHTML = value
    message_tag.style.left = '28vw';
}

function play(initial_score) {
    total_score = initial_score
    
    function checkColition(bird, pipe) {
        // Bird hits a pipe
        return bird.left < pipe.left + pipe.width &&
            bird.left + bird.width > pipe.left &&
            bird.top < pipe.top + pipe.height &&
            bird.top + bird.height > pipe.top;
    }

    function checkOutOfGame(bird, game_area){
        // bird out of window
        return bird.top <= 0 || bird.bottom >= game_area.bottom
    }

    function endOfGame(final_score){        
        // Change game state and end the game
        game_state = 'End';
        setMessage(`You lose... Try to do better than ${final_score}`);
    }

    function move() {
        // Detect if game has ended
        if (game_state != 'Play') return;
        
        bird_props = bird.getBoundingClientRect();
        if (checkOutOfGame(bird_props, background)){
            endOfGame(score_val.innerHTML);
            return;
        }

        // Getting reference to all the pipe elements
        let pipe_sprite = document.querySelectorAll('.pipe_sprite');
        pipe_sprite.forEach((element) => {

            let pipe_sprite_props = element.getBoundingClientRect();
            bird_props = bird.getBoundingClientRect();

            // Delete the pipes if they have moved out
            // of the screen hence saving memory
            if (pipe_sprite_props.right <= 0) {
                element.remove();
                return;
            }

            if (checkColition(bird_props, pipe_sprite_props)){
                // Change game state and end the game
                // if collision occurs
                endOfGame(score_val.innerHTML);
                return;
            }
            // Increase the score if player
            // has the successfully dodged pipes
            if (
                pipe_sprite_props.right < bird_props.left &&
                pipe_sprite_props.right + move_speed >= bird_props.left &&
                element.increase_score == '1'
            ) {
                total_score += 1;
            }
            element.style.left = pipe_sprite_props.left - move_speed + 'px';
        });

        setScore(total_score)
        requestAnimationFrame(move);
    }
    requestAnimationFrame(move);

    let ask_to_move = false
    let bird_dy = 0;
    function apply_gravity() {
        if (game_state != 'Play') return;
        bird_dy = bird_dy + gravity;
        
        document.addEventListener('keydown', (e) => {
            if (e.key == 'ArrowUp' || e.code == 'Space') {
                bird_dy = -7.6;
                ask_to_move = true
            }
        });
        if(!ask_to_move)
            document.addEventListener('click', (e) => bird_dy = -7.6);

        ask_to_move = false
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

document.addEventListener('keydown', (e) => {
    // Start the game if enter key is pressed
    if (e.code == 'Space' && game_state != 'Play') {
        startNewGame()
    }
});

document.addEventListener('click', (e) => {
    // Start the game if enter key is pressed
    if (game_state != 'Play') {
        startNewGame()
    }
});