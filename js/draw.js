var canvas;
var container;
var context;

var objects = [];
var texts = [];
var buttons = [];
var pseudoButtons = [];
var num_of_images;
var img_refs;

var fade_timer = null;

var claims = [];
var max_claims = [3, 1, 3, 5, 1, 0, 3, 1, 2];

var current_state;
var stack_i;

drawInit();

/* Função que inicializa o necessario para começar a desenhar no canvas
*   Retorno: sem retorno.
*/
function drawInit() {
    $(window).load(function() {
        canvas = $("#banker_canvas").get(0);
        container = $("#banker_canvas").parent();
        context = canvas.getContext("2d");
    
        $(canvas).click(function(event) {
            var x = 0;
            var y = 0;
            var totalOffsetX = 0;
            var totalOffsetY = 0;
            var currentElement = canvas;

            do {
                totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
                totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
                currentElement = currentElement.offsetParent;
            }
            while(currentElement != null);

            if (event.offsetX !== undefined && event.offsetY !== undefined) {
                x = event.offsetX;
                y = event.offsetY;
            }
            else if (event.pageX != undefined && event.pageY != undefined) {
                x = event.pageX - totalOffsetX;
                y = event.pageY - totalOffsetY;
            }
            else {// Firefox method to get the position
                x = event.clientX + document.body.scrollLeft +
                    document.documentElement.scrollLeft - totalOffsetX;
                y = event.clientY + document.body.scrollTop +
                    document.documentElement.scrollTop - totalOffsetY;
            }
        
            x = Math.round(x * (canvas.width / canvas.offsetWidth));
            y = Math.round(y * (canvas.height / canvas.offsetHeight));

            collisions(x, y);
        });
        
        //Executa respondCanvas se o browser for redimensionado
        $(window).resize( respondCanvas );
        
        changeState("INIT_STATE");
    });
}

/* Função que carrega uma imagem.
*   Retorno: sem retorno.
*/
function loadImage(name) {
    var i = objects.length;
    
    objects.push({
        image: new Image(),
        visibility: true,
        x: 0,
        y: 0,
        alpha: 1
    });
    
    $(objects[i].image).load(function() {
        img_refs++;
        if(img_refs >= num_of_images) {
            draw();
        }
    });
    objects[i].image.src = "img/"+name+".png";
}

/* Função que carrega um botão.
*   Retorno: sem retorno.
*/
function loadButton(name, button_funct) {
    var i = buttons.length;
    
    buttons.push({
        image: new Image(),
        visibility: true,
        x: 0,
        y: 0,
        funct: button_funct
    });
    
    $(buttons[i].image).load(function() {
        img_refs++;
        if(img_refs >= num_of_images) {
            draw();
        }
    });
    buttons[i].image.src = "img/"+name+".png";
}

/* Função para criar um texto a ser impresso no canvas
*   Retorno: sem retorno.
*/
function createText(text, textfont, maxWidth) {
    texts.push({
        value: text,
        visibility: true,
        x: 0,
        y: 0,
        font: textfont,
        max_width: maxWidth
    });
}

/* Função que desenha no canvas correspondente.
*   Retorno: sem retorno.
*/
function draw() {
    context.globalAlpha = 1;
    // Limpa a tela
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    // Desenha todas as imagens visíveis
    var i;
    for (i = 0; i < objects.length; i++) {
        if(objects[i].visibility == true) {
            context.drawImage(objects[i].image, objects[i].x, objects[i].y);
        }
    }
    for (i = 0; i < buttons.length; i++) {
        if(buttons[i].visibility == true) {
            context.drawImage(buttons[i].image, buttons[i].x, buttons[i].y);
        }
    }
    for (i = 0; i < texts.length; i++) {
        if(texts[i].visibility == true) {
            context.font = texts[i].font;
            if(texts[i].max_width == 0) {
                context.fillText(texts[i].value, texts[i].x, texts[i].y + 22);
            }
            else {
                context.fillText(texts[i].value, texts[i].x, texts[i].y + 22, texts[i].max_width);
            }
        }
    }
}

/* Função que redimensiona o canvas
*   Retorno: sem retorno.
*/
function respondCanvas(){ 
        $(canvas).attr('width', $(container).width() ); //max width
        $(canvas).attr('height', $(container).height() ); //max height

        draw();
}

/* Função que detecta colisoes
*   Retorno: sem retorno.
*/
function collisions(x, y)
{
    //alert("x: " + x + "  y: " + y);
    
    var i;
    for(i = 0; i < buttons.length; i++) {
        if(x >= buttons[i].x && y >= buttons[i].y && x <= (buttons[i].x + buttons[i].image.width) && y <= (buttons[i].y + buttons[i].image.height) ) {
            buttons[i].funct();
            return;
        }
    }
    for(i = 0; i < pseudoButtons.length; i++) {
        if(x >= pseudoButtons[i].x && y >= pseudoButtons[i].y && x < (pseudoButtons[i].x + pseudoButtons[i].width) && y < (pseudoButtons[i].y + pseudoButtons[i].height) ) {
            pseudoButtons[i].funct(i);
            return;
        }
    }
}

/* Função que realiza fade-in(fadeout = false) ou fade-out(fadeout = true)
*   Retorno: sem retorno.
*/
function fade(obj, fadeout) {
    if(fade_timer != null) {
        setTimeout(function() {
            fade(obj, fadeout);
        }, 500);
        return;
    }
    if(fadeout == false) {
        obj.alpha = 0;
    }
    else {
        obj.alpha = 1;
    }
    
    obj.visibility = !obj.visibility;
    
    fade_timer = setInterval(function() {fadeloop(obj, fadeout)}, 34);
}

/* Função auxiliar de fade
*   Retorno: sem retorno.
*/
function fadeloop(obj, fadeout) {
    if(fadeout == false) {
        obj.alpha += 0.05;
    }
    else {
        obj.alpha -= 0.05;
    }

    if (obj.alpha <= 0 || obj.alpha >= 1) {
        clearInterval(fade_timer);
        fade_timer = null;
        draw();
        return;
    }
        
    /// clear canvas
    context.clearRect(obj.x, obj.y, obj.image.width, obj.image.height);
        
    /// set global alpha
    context.globalAlpha = obj.alpha;
        
    /// re-draw image
    context.drawImage(obj.image, obj.x, obj.y);
}

/* Função que gerencia a troca de estados da MEF
*   Retorno: sem retorno.
*/
function changeState(newState) {
    objects = [];
    buttons = [];
    pseudoButtons = [];
    texts = [];
    img_refs = 0;
    
    current_state = newState;
    
    if(newState == "INIT_STATE") {
        claims = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        
        num_of_images = 6;
        
        loadImage("allocated_table");
        objects[0].x = 340;
        objects[0].y = 0;
        
        loadImage("m_claim_table");
        objects[1].x = 340;
        objects[1].y = 220;
        
        loadImage("allocated_array");
        objects[2].x = 0;
        objects[2].y = 0;
        
        loadImage("available_array");
        objects[3].x = 0;
        objects[3].y = 100;
        
        loadImage("maximum_array");
        objects[4].x = 0;
        objects[4].y = 200;
        
        pseudoButtons.push({
            x: 491,
            y: 52,
            width: 50,
            height: 50,
            funct: claim_button
        });
        createText(claims[0].toString(), "30px sans-serif", 0);
        texts[0].x = 502;
        texts[0].y = 65;
        
        pseudoButtons.push({
            x: 541,
            y: 52,
            width: 50,
            height: 50,
            funct: claim_button
        });
        createText(claims[1].toString(), "30px sans-serif", 0);
        texts[1].x = 552;
        texts[1].y = 65;
        
        pseudoButtons.push({
            x: 591,
            y: 52,
            width: 50,
            height: 50,
            funct: claim_button
        });
        createText(claims[2].toString(), "30px sans-serif", 0);
        texts[2].x = 602;
        texts[2].y = 65;
        
        pseudoButtons.push({
            x: 491,
            y: 102,
            width: 50,
            height: 50,
            funct: claim_button
        });
        createText(claims[3].toString(), "30px sans-serif", 0);
        texts[3].x = 502;
        texts[3].y = 115;
        
        pseudoButtons.push({
            x: 541,
            y: 102,
            width: 50,
            height: 50,
            funct: claim_button
        });
        createText(claims[4].toString(), "30px sans-serif", 0);
        texts[4].x = 552;
        texts[4].y = 115;
        
        pseudoButtons.push({
            x: 591,
            y: 102,
            width: 50,
            height: 50,
            funct: claim_button
        });
        createText(claims[5].toString(), "30px sans-serif", 0);
        texts[5].x = 602;
        texts[5].y = 115;
        
        pseudoButtons.push({
            x: 491,
            y: 152,
            width: 50,
            height: 50,
            funct: claim_button
        });
        createText(claims[6].toString(), "30px sans-serif", 0);
        texts[6].x = 502;
        texts[6].y = 165;
        
        pseudoButtons.push({
            x: 541,
            y: 152,
            width: 50,
            height: 50,
            funct: claim_button
        });
        createText(claims[7].toString(), "30px sans-serif", 0);
        texts[7].x = 552;
        texts[7].y = 165;
        
        pseudoButtons.push({
            x: 591,
            y: 152,
            width: 50,
            height: 50,
            funct: claim_button
        });
        createText(claims[8].toString(), "30px sans-serif", 0);
        texts[8].x = 602;
        texts[8].y = 165;
        
        
        createText(max_claims[0].toString(), "30px sans-serif", 0);
        texts[9].x = 502;
        texts[9].y = 285;
        
        createText(max_claims[1].toString(), "30px sans-serif", 0);
        texts[10].x = 552;
        texts[10].y = 285;
        
        createText(max_claims[2].toString(), "30px sans-serif", 0);
        texts[11].x = 602;
        texts[11].y = 285;
        
        createText(max_claims[3].toString(), "30px sans-serif", 0);
        texts[12].x = 502;
        texts[12].y = 335;
        
        createText(max_claims[4].toString(), "30px sans-serif", 0);
        texts[13].x = 552;
        texts[13].y = 335;
        
        createText(max_claims[5].toString(), "30px sans-serif", 0);
        texts[14].x = 602;
        texts[14].y = 335;
        
        createText(max_claims[6].toString(), "30px sans-serif", 0);
        texts[15].x = 502;
        texts[15].y = 385;
        
        createText(max_claims[7].toString(), "30px sans-serif", 0);
        texts[16].x = 552;
        texts[16].y = 385;
        
        createText(max_claims[8].toString(), "30px sans-serif", 0);
        texts[17].x = 602;
        texts[17].y = 385;
        
        createText(get_string.allocated_table, "18px sans-serif", 0);
        texts[18].x = 345;
        texts[18].y = 160;
        createText(get_string.m_claim_table, "18px sans-serif", 0);
        texts[19].x = 330;
        texts[19].y = 382;
        
        createText(get_string.allocated_array, "18px sans-serif", 0);
        texts[20].x = 130;
        texts[20].y = 25;
        createText(get_string.available_array, "18px sans-serif", 0);
        texts[21].x = 130;
        texts[21].y = 125;
        createText(get_string.maximum_array, "18px sans-serif", 0);
        texts[22].x = 130;
        texts[22].y = 225;
        
        createText(0, "30px sans-serif", 0);
        texts[23].x = 112;
        texts[23].y = 65;
        createText(0, "30px sans-serif", 0);
        texts[24].x = 162;
        texts[24].y = 65;
        createText(0, "30px sans-serif", 0);
        texts[25].x = 212;
        texts[25].y = 65;
        
        createText(5, "30px sans-serif", 0);
        texts[26].x = 112;
        texts[26].y = 165;
        createText(2, "30px sans-serif", 0);
        texts[27].x = 162;
        texts[27].y = 165;
        createText(3, "30px sans-serif", 0);
        texts[28].x = 212;
        texts[28].y = 165;
        
        createText(5, "30px sans-serif", 0);
        texts[29].x = 112;
        texts[29].y = 265;
        createText(2, "30px sans-serif", 0);
        texts[30].x = 162;
        texts[30].y = 265;
        createText(3, "30px sans-serif", 0);
        texts[31].x = 212;
        texts[31].y = 265;
        
        loadButton("next_button", next_button);
        buttons[0].x = 540;
        buttons[0].y = 430;
        
        createText(get_string.banker_init1, "18px sans-serif", 0);
        texts[32].x = 0;
        texts[32].y = 320;
        createText(get_string.banker_init2, "18px sans-serif", 0);
        texts[33].x = 0;
        texts[33].y = 338;
    }
    else if(newState == "BANKER_1_SUCCESS_STATE") {
        num_of_images = 7;
        
        loadImage("allocated_table");
        objects[0].x = 340;
        objects[0].y = 0;
        
        loadImage("m_claim_table");
        objects[1].x = 340;
        objects[1].y = 220;
        
        loadImage("allocated_array");
        objects[2].x = 0;
        objects[2].y = 0;
        
        objects[2].visibility = false;
        fade(objects[2], false);
        
        loadImage("available_array");
        objects[3].x = 0;
        objects[3].y = 100;
        
        loadImage("maximum_array");
        objects[4].x = 0;
        objects[4].y = 200;
        
        createText(stateStack[stack_i].allocationMatrix.elements[0][0], "30px sans-serif", 0);
        texts[0].x = 502;
        texts[0].y = 65;
        
        createText(stateStack[stack_i].allocationMatrix.elements[0][1], "30px sans-serif", 0);
        texts[1].x = 552;
        texts[1].y = 65;
        
        createText(stateStack[stack_i].allocationMatrix.elements[0][2], "30px sans-serif", 0);
        texts[2].x = 602;
        texts[2].y = 65;
        
        createText(stateStack[stack_i].allocationMatrix.elements[1][0], "30px sans-serif", 0);
        texts[3].x = 502;
        texts[3].y = 115;
        
        createText(stateStack[stack_i].allocationMatrix.elements[1][1], "30px sans-serif", 0);
        texts[4].x = 552;
        texts[4].y = 115;
        
        createText(stateStack[stack_i].allocationMatrix.elements[1][2], "30px sans-serif", 0);
        texts[5].x = 602;
        texts[5].y = 115;
        
        createText(stateStack[stack_i].allocationMatrix.elements[2][0], "30px sans-serif", 0);
        texts[6].x = 502;
        texts[6].y = 165;
        
        createText(stateStack[stack_i].allocationMatrix.elements[2][1], "30px sans-serif", 0);
        texts[7].x = 552;
        texts[7].y = 165;

        createText(stateStack[stack_i].allocationMatrix.elements[2][2], "30px sans-serif", 0);
        texts[8].x = 602;
        texts[8].y = 165;
        
        
        createText(max_claims[0].toString(), "30px sans-serif", 0);
        texts[9].x = 502;
        texts[9].y = 285;
        
        createText(max_claims[1].toString(), "30px sans-serif", 0);
        texts[10].x = 552;
        texts[10].y = 285;
        
        createText(max_claims[2].toString(), "30px sans-serif", 0);
        texts[11].x = 602;
        texts[11].y = 285;
        
        createText(max_claims[3].toString(), "30px sans-serif", 0);
        texts[12].x = 502;
        texts[12].y = 335;
        
        createText(max_claims[4].toString(), "30px sans-serif", 0);
        texts[13].x = 552;
        texts[13].y = 335;
        
        createText(max_claims[5].toString(), "30px sans-serif", 0);
        texts[14].x = 602;
        texts[14].y = 335;
        
        createText(max_claims[6].toString(), "30px sans-serif", 0);
        texts[15].x = 502;
        texts[15].y = 385;
        
        createText(max_claims[7].toString(), "30px sans-serif", 0);
        texts[16].x = 552;
        texts[16].y = 385;
        
        createText(max_claims[8].toString(), "30px sans-serif", 0);
        texts[17].x = 602;
        texts[17].y = 385;
        
        createText(get_string.allocated_table, "18px sans-serif", 0);
        texts[18].x = 345;
        texts[18].y = 160;
        createText(get_string.m_claim_table, "18px sans-serif", 0);
        texts[19].x = 330;
        texts[19].y = 382;
        
        createText(get_string.allocated_array, "18px sans-serif", 0);
        texts[20].x = 130;
        texts[20].y = 25;
        texts[20].visibility = false;
        setTimeout(function() {
            texts[20].visibility = true;
        }, 500);
        createText(get_string.available_array, "18px sans-serif", 0);
        texts[21].x = 130;
        texts[21].y = 125;
        createText(get_string.maximum_array, "18px sans-serif", 0);
        texts[22].x = 130;
        texts[22].y = 225;
        
        createText(0, "30px sans-serif", 0);
        texts[23].x = 112;
        texts[23].y = 65;
        texts[23].visibility = false;
        setTimeout(function() {
            texts[23].visibility = true;
        }, 500);
        createText(0, "30px sans-serif", 0);
        texts[24].x = 162;
        texts[24].y = 65;
        texts[24].visibility = false;
        setTimeout(function() {
            texts[24].visibility = true;
        }, 500);
        createText(0, "30px sans-serif", 0);
        texts[25].x = 212;
        texts[25].y = 65;
        texts[25].visibility = false;
        setTimeout(function() {
            texts[25].visibility = true;
        }, 500);
        
        createText(0, "30px sans-serif", 0);
        texts[26].x = 112;
        texts[26].y = 165;
        createText(0, "30px sans-serif", 0);
        texts[27].x = 162;
        texts[27].y = 165;
        createText(0, "30px sans-serif", 0);
        texts[28].x = 212;
        texts[28].y = 165;
        
        createText(0, "30px sans-serif", 0);
        texts[29].x = 112;
        texts[29].y = 265;
        createText(0, "30px sans-serif", 0);
        texts[30].x = 162;
        texts[30].y = 265;
        createText(0, "30px sans-serif", 0);
        texts[31].x = 212;
        texts[31].y = 265;
        
        loadButton("next_button", next_button);
        buttons[0].x = 540;
        buttons[0].y = 430;
        loadButton("previous_button", previous_button);
        buttons[1].x = 430;
        buttons[1].y = 430;
        
        createText(get_string.banker_11, "18px sans-serif", 0);
        texts[32].x = 0;
        texts[32].y = 320;
        createText(get_string.banker_12, "18px sans-serif", 0);
        texts[33].x = 0;
        texts[33].y = 338;
        createText(get_string.banker_13, "18px sans-serif", 0);
        texts[34].x = 0;
        texts[34].y = 356;
        createText(get_string.banker_14, "18px sans-serif", 0);
        texts[35].x = 0;
        texts[35].y = 374;
        createText(get_string.banker_1_succ, "18px sans-serif", 0);
        texts[36].x = 0;
        texts[36].y = 392;
    }
    else if(newState == "BANKER_1_FAIL_STATE") {
        alert(stack_i);
        num_of_images = 7;
        
        loadImage("allocated_table");
        objects[0].x = 340;
        objects[0].y = 0;
        
        loadImage("m_claim_table");
        objects[1].x = 340;
        objects[1].y = 220;
        
        loadImage("allocated_array");
        objects[2].x = 0;
        objects[2].y = 0;
        
        loadImage("available_array");
        objects[3].x = 0;
        objects[3].y = 100;
        
        loadImage("maximum_array");
        objects[4].x = 0;
        objects[4].y = 200;
        
        createText(stateStack[stack_i].allocationMatrix.elements[0][0], "30px sans-serif", 0);
        texts[0].x = 502;
        texts[0].y = 65;
        
        createText(stateStack[stack_i].allocationMatrix.elements[0][1], "30px sans-serif", 0);
        texts[1].x = 552;
        texts[1].y = 65;
        
        createText(stateStack[stack_i].allocationMatrix.elements[0][2], "30px sans-serif", 0);
        texts[2].x = 602;
        texts[2].y = 65;
        
        createText(stateStack[stack_i].allocationMatrix.elements[1][0], "30px sans-serif", 0);
        texts[3].x = 502;
        texts[3].y = 115;
        
        createText(stateStack[stack_i].allocationMatrix.elements[1][1], "30px sans-serif", 0);
        texts[4].x = 552;
        texts[4].y = 115;
        
        createText(stateStack[stack_i].allocationMatrix.elements[1][2], "30px sans-serif", 0);
        texts[5].x = 602;
        texts[5].y = 115;
        
        createText(stateStack[stack_i].allocationMatrix.elements[2][0], "30px sans-serif", 0);
        texts[6].x = 502;
        texts[6].y = 165;
        
        createText(stateStack[stack_i].allocationMatrix.elements[2][1], "30px sans-serif", 0);
        texts[7].x = 552;
        texts[7].y = 165;
        
        createText(stateStack[stack_i].allocationMatrix.elements[2][2], "30px sans-serif", 0);
        texts[8].x = 602;
        texts[8].y = 165;
        
        
        createText(max_claims[0].toString(), "30px sans-serif", 0);
        texts[9].x = 502;
        texts[9].y = 285;
        
        createText(max_claims[1].toString(), "30px sans-serif", 0);
        texts[10].x = 552;
        texts[10].y = 285;
        
        createText(max_claims[2].toString(), "30px sans-serif", 0);
        texts[11].x = 602;
        texts[11].y = 285;
        
        createText(max_claims[3].toString(), "30px sans-serif", 0);
        texts[12].x = 502;
        texts[12].y = 335;
        
        createText(max_claims[4].toString(), "30px sans-serif", 0);
        texts[13].x = 552;
        texts[13].y = 335;
        
        createText(max_claims[5].toString(), "30px sans-serif", 0);
        texts[14].x = 602;
        texts[14].y = 335;
        
        createText(max_claims[6].toString(), "30px sans-serif", 0);
        texts[15].x = 502;
        texts[15].y = 385;
        
        createText(max_claims[7].toString(), "30px sans-serif", 0);
        texts[16].x = 552;
        texts[16].y = 385;
        
        createText(max_claims[8].toString(), "30px sans-serif", 0);
        texts[17].x = 602;
        texts[17].y = 385;
        
        createText(get_string.allocated_table, "18px sans-serif", 0);
        texts[18].x = 345;
        texts[18].y = 160;
        createText(get_string.m_claim_table, "18px sans-serif", 0);
        texts[19].x = 330;
        texts[19].y = 382;
        
        createText(get_string.allocated_array, "18px sans-serif", 0);
        texts[20].x = 130;
        texts[20].y = 25;
        createText(get_string.available_array, "18px sans-serif", 0);
        texts[21].x = 130;
        texts[21].y = 125;
        createText(get_string.maximum_array, "18px sans-serif", 0);
        texts[22].x = 130;
        texts[22].y = 225;
        
        createText(0, "30px sans-serif", 0);
        texts[23].x = 112;
        texts[23].y = 65;
        createText(0, "30px sans-serif", 0);
        texts[24].x = 162;
        texts[24].y = 65;
        createText(0, "30px sans-serif", 0);
        texts[25].x = 212;
        texts[25].y = 65;
        
        createText(0, "30px sans-serif", 0);
        texts[26].x = 112;
        texts[26].y = 165;
        createText(0, "30px sans-serif", 0);
        texts[27].x = 162;
        texts[27].y = 165;
        createText(0, "30px sans-serif", 0);
        texts[28].x = 212;
        texts[28].y = 165;
        
        createText(0, "30px sans-serif", 0);
        texts[29].x = 112;
        texts[29].y = 265;
        createText(0, "30px sans-serif", 0);
        texts[30].x = 162;
        texts[30].y = 265;
        createText(0, "30px sans-serif", 0);
        texts[31].x = 212;
        texts[31].y = 265;
        
        loadButton("next_button", next_button);
        buttons[0].x = 540;
        buttons[0].y = 430;
        loadButton("previous_button", previous_button);
        buttons[1].x = 430;
        buttons[1].y = 430;
        
        createText(get_string.banker_11, "18px sans-serif", 0);
        texts[32].x = 0;
        texts[32].y = 320;
        createText(get_string.banker_12, "18px sans-serif", 0);
        texts[33].x = 0;
        texts[33].y = 338;
        createText(get_string.banker_13, "18px sans-serif", 0);
        texts[34].x = 0;
        texts[34].y = 356;
        createText(get_string.banker_14, "18px sans-serif", 0);
        texts[35].x = 0;
        texts[35].y = 374;
        createText(get_string.banker_1_fail1, "18px sans-serif", 0);
        texts[36].x = 0;
        texts[36].y = 392;
        createText(get_string.banker_1_fail2, "18px sans-serif", 0);
        texts[37].x = 0;
        texts[37].y = 410;
    }
    else if(newState == "BANKER_2_STATE") {
        num_of_images = 7;
        
        loadImage("allocated_table");
        objects[0].x = 340;
        objects[0].y = 0;
        
        loadImage("m_claim_table");
        objects[1].x = 340;
        objects[1].y = 220;
        
        loadImage("allocated_array");
        objects[2].x = 0;
        objects[2].y = 0;
        
        loadImage("available_array");
        objects[3].x = 0;
        objects[3].y = 100;
        
        loadImage("maximum_array");
        objects[4].x = 0;
        objects[4].y = 200;
        
        createText(stateStack[stack_i].allocationMatrix.elements[0][0], "30px sans-serif", 0);
        texts[0].x = 502;
        texts[0].y = 65;
        
        createText(stateStack[stack_i].allocationMatrix.elements[0][1], "30px sans-serif", 0);
        texts[1].x = 552;
        texts[1].y = 65;
        
        createText(stateStack[stack_i].allocationMatrix.elements[0][2], "30px sans-serif", 0);
        texts[2].x = 602;
        texts[2].y = 65;
        
        createText(stateStack[stack_i].allocationMatrix.elements[1][0], "30px sans-serif", 0);
        texts[3].x = 502;
        texts[3].y = 115;
        
        createText(stateStack[stack_i].allocationMatrix.elements[1][1], "30px sans-serif", 0);
        texts[4].x = 552;
        texts[4].y = 115;
        
        createText(stateStack[stack_i].allocationMatrix.elements[1][2], "30px sans-serif", 0);
        texts[5].x = 602;
        texts[5].y = 115;
        
        createText(stateStack[stack_i].allocationMatrix.elements[2][0], "30px sans-serif", 0);
        texts[6].x = 502;
        texts[6].y = 165;
        
        createText(stateStack[stack_i].allocationMatrix.elements[2][1], "30px sans-serif", 0);
        texts[7].x = 552;
        texts[7].y = 165;
        
        createText(stateStack[stack_i].allocationMatrix.elements[2][2], "30px sans-serif", 0);
        texts[8].x = 602;
        texts[8].y = 165;
        
        
        createText(max_claims[0].toString(), "30px sans-serif", 0);
        texts[9].x = 502;
        texts[9].y = 285;
        
        createText(max_claims[1].toString(), "30px sans-serif", 0);
        texts[10].x = 552;
        texts[10].y = 285;
        
        createText(max_claims[2].toString(), "30px sans-serif", 0);
        texts[11].x = 602;
        texts[11].y = 285;
        
        createText(max_claims[3].toString(), "30px sans-serif", 0);
        texts[12].x = 502;
        texts[12].y = 335;
        
        createText(max_claims[4].toString(), "30px sans-serif", 0);
        texts[13].x = 552;
        texts[13].y = 335;
        
        createText(max_claims[5].toString(), "30px sans-serif", 0);
        texts[14].x = 602;
        texts[14].y = 335;
        
        createText(max_claims[6].toString(), "30px sans-serif", 0);
        texts[15].x = 502;
        texts[15].y = 385;
        
        createText(max_claims[7].toString(), "30px sans-serif", 0);
        texts[16].x = 552;
        texts[16].y = 385;
        
        createText(max_claims[8].toString(), "30px sans-serif", 0);
        texts[17].x = 602;
        texts[17].y = 385;
        
        createText(get_string.allocated_table, "18px sans-serif", 0);
        texts[18].x = 345;
        texts[18].y = 160;
        createText(get_string.m_claim_table, "18px sans-serif", 0);
        texts[19].x = 330;
        texts[19].y = 382;
        
        createText(get_string.allocated_array, "18px sans-serif", 0);
        texts[20].x = 130;
        texts[20].y = 25;
        createText(get_string.available_array, "18px sans-serif", 0);
        texts[21].x = 130;
        texts[21].y = 125;
        createText(get_string.maximum_array, "18px sans-serif", 0);
        texts[22].x = 130;
        texts[22].y = 225;
        
        createText(0, "30px sans-serif", 0);
        texts[23].x = 112;
        texts[23].y = 65;
        createText(0, "30px sans-serif", 0);
        texts[24].x = 162;
        texts[24].y = 65;
        createText(0, "30px sans-serif", 0);
        texts[25].x = 212;
        texts[25].y = 65;
        
        createText(0, "30px sans-serif", 0);
        texts[26].x = 112;
        texts[26].y = 165;
        createText(0, "30px sans-serif", 0);
        texts[27].x = 162;
        texts[27].y = 165;
        createText(0, "30px sans-serif", 0);
        texts[28].x = 212;
        texts[28].y = 165;
        
        createText(0, "30px sans-serif", 0);
        texts[29].x = 112;
        texts[29].y = 265;
        createText(0, "30px sans-serif", 0);
        texts[30].x = 162;
        texts[30].y = 265;
        createText(0, "30px sans-serif", 0);
        texts[31].x = 212;
        texts[31].y = 265;
        
        loadButton("next_button", next_button);
        buttons[0].x = 540;
        buttons[0].y = 430;
        loadButton("previous_button", previous_button);
        buttons[1].x = 430;
        buttons[1].y = 430;
        
        createText(get_string.banker_21, "18px sans-serif", 0);
        texts[32].x = 0;
        texts[32].y = 320;
        createText(get_string.banker_22, "18px sans-serif", 0);
        texts[33].x = 0;
        texts[33].y = 338;
    }
    else {
        // Estado Inválido
    }
}

function next_button() {
    if(current_state == "INIT_STATE") {
        
        var allocationMatrix = new Matrix( 3, 3 ); // Matriz que indica quantos recursos de cada tipo estão alocados a um determinado processo.
    
        allocationMatrix.elements[0] = [ claims[0], claims[1], claims[2] ];
        allocationMatrix.elements[1] = [ claims[3], claims[4], claims[5] ];
        allocationMatrix.elements[2] = [ claims[6], claims[7], claims[8] ];
    
        banker(allocationMatrix);
        
        stack_i = 0;
    
        if(stateStack[0].state == "BANKER_1_SUCCESS_STATE") {
            fade(objects[2], true);
            setTimeout(function() {
                changeState("BANKER_1_SUCCESS_STATE"); //mudar
            }, 500);
        }
        else {
            changeState(stateStack[0].state);
        }
    }
    else if ((stack_i + 1) == stateStack.length) {
        changeState("INIT_STATE");
        stateStack = [];
    }
    else {
        stack_i += 1;
        changeState(stateStack[stack_i].state);
    }
}

function previous_button() {
    stack_i -= 1;
    if(stack_i < 0) {
        current_state == "INIT_STATE"
        stateStack = [];
    }
    else {
        changeState(stateStack[stack_i].state);
    }
}

function claim_button(i) {
    claims[i] += 1;
    
    if(claims[i] > max_claims[i]) {
        claims[i] = max_claims[i];
    }
    
    texts[i].value = claims[i];
    
    draw();
}