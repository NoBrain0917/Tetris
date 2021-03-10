GameAudio = function() {

    var audioLoop = new Howl({urls:[`./audios/main${Math.floor(Math.random()*5)+1}.mp3`],volume:0.2,onend: function() {
        var a = Math.floor(Math.random()*5)+1
        audioLoop.stop()
        audioLoop._duration = 0; 
        audioLoop._sprite = {};
        audioLoop._src = `./audios/main${a}.mp3`
        audioLoop._urls = [`./audios/main${a}.mp3`]
        audioLoop.load();
        setTimeout(function(){audioLoop.play();},1000)
    }});

    var remix = new Howl({urls:[`./audios/remix.mp3`],volume:0.2,onend: function() {
        remix.play();
    }});

    this.hit = new Howl({urls:["./audios/hit.mp3"],volume:0.6});
    this.main = audioLoop;
    this.remix = remix;
    this.lineRemove = new Howl({urls:["./audios/lineRemove.mp3"],volume:0.3});
    this.blockRotate = new Howl({urls:["./audios/blockRotate.mp3"],volume:0.3});
    this.gameOver = new Howl({urls:["./audios/gameOver.mp3"]});
}
