# 🤖 InHouseBot
An in-house bot that drafts 2 teams and has a MMR system was made for any game that you play 5v5.

## ⌨️ Commands:

<details>
  <summary> /addplayer </summary>
  
  - Adds a player to the list of the players (only players added can use another commands expect: */help*). A player starts with 50mmr points.
  
    * options:
        - player - Select a user from discord server.
     
</details>
<details>
  <summary> /lobby </summary>
  
  - Creates a lobby, then players can use */join* to enter the lobby
  
</details>

<details>
  <summary> /join </summary>
  
  - Join a created lobby. When the lobby reaches 10 players, the bot will make the 2 teams equalized based on mmr.
</details>

<details>
  <summary> /lobbyresult </summary>
  
  - When a game is defined use */lobbyresult* to record the result of the lobby, this will also update mmrs and wins/loses/games of the players of the lobby. The players of the winner team wins 5mmr points, the players of loser team lose 5mmr points.
  
    * options:
        - lobbynumber - The number of the lobby we wanna defined the result.
        - winnerteam - The team that won the lobby.
</details>

<details>
  <summary> /leave </summary>
  
  - Leave from a created lobby joinned before. Notice: you can't leave a lobby alredy in progress.
</details>

<details>
  <summary> /playerinfo </summary>
  
  - Shows info of a player.
      * options:
        - player - Select a player from discord server
</details>

</details>

<details>
  <summary> /deletelobby </summary>
  
  - Deletes a lobby openned (undefined teams) or in progress (defined teams).
      * options:
        - lobbynumber - The number of the lobby we wanna delete.
</details>

<details>
  <summary> /ranking </summary>
  
  - Shows ranking of players based on selected option.
      * options:
        - option - Select between: Top 10 MMR, Bot 10 MMR, Top 10 Wins or Top 10 Loses
  
  
</details>

<details>
  <summary> /allplayers </summary>
  
  - Shows all players who have been added to the inhouse.
</details>

<details>
  <summary> /help </summary>
  
  - Shows commands info.
</details>

## 📦 How to use:
You need to have [node.js](https://nodejs.org/en) installed.

Clone the project.

Install required packages into the project:
  ```bash
npm install
  ```

Now copy the .env.example file to **.env** file to the project:
  ```.bash
copy .env.example .env
  ```

Now, you need to create a bot in the [discord developer portal](https://discord.com/developers/applications).
Click on New Application and give it a cool name.
On the **General Information** tab copy the APPLICATION ID and past on the CLIENT_ID variable on .env file, like this example: 

  ```.env
TOKEN=
CLIENT_ID=0123456789876543210
  ```

Now, on the **Bot** tab, click on "Reset Token" to generate a new `Token`. 
Copy the `token` to the .env file:
> Remember, it's crucial not to share this token with anyone else.

The `.env` file should be like this example:
  ```.env
TOKEN=EXAMPLE01234TOKEN
CLIENT_ID=0123456789876543210
  ```

**THIS IS A VERY IMPORTANT STEP:**

On the 'OAuth2' tab, under the 'OAuth2 URL Generator' session, select **bot** and **applications.commands**. Then, in the 'BOT PERMISSIONS' section, check the **Administrator** checkbox. This will generate the link to add the bot to a server. Simply paste the generated link into your browser to add the bot to your server.

Now, run the command:
   ```js
npm start
  ```


The bot is now up and running! Head over to your server and enjoy it!

Notice: The bot may take up to 5 minutes to register the commands.

> Once it's running, you can add the bot to multiple servers, and it will work seamlessly on all of them.

If you encounter any issues or have suggestions for improvements, feel free to contact me at any time:

[<img src="https://img.shields.io/badge/-Gmail-FF0000?style=flat-square&labelColor=FF0000&logo=gmail&logoColor=white&link=" alt="Gmail"/></a>](mailto:katson.alves@ccc.ufcg.edu.br)
[<img src="https://img.shields.io/badge/-Linkedin-0e76a8?style=flat-square&logo=Linkedin&logoColor=white&link=" alt="LinkedIn"/></a>](https://www.linkedin.com/in/katsonmatheus/)

⭐ If you've made it this far, please consider giving this repository a star! ⭐
 
## Author:
- [Katson](https://github.com/katson1)
