define(['order!enchant'], function (){
        enchant();
        var game = new Game(320, 320);
        game.onload = function (){
                 game.rootScene.addChild(new Label('Hello, world!'));
        };
        game.start();
});