# 🤖 InHouseBot
An in-house bot that drafts 2 teams and has an MMR system was made for Heroes of the Storm custom games, but it can be used for any game that you play 5v5.

## ⌨️ Commands:

<details>
  <summary> /addplayer </summary>
  
  - Adds a player to the list of the players (only players added can use another commands expect: */help*). A player starts with 50mmr points.
  
    * options:
        - player - Select a user from discord server.
        - role1 - Select a role, the bot will suggest: Healer, Tank, Assassin Flex, Assassin Ranged or Flex.
        - role2 - Select another role.
     
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
  
  - Shows info of commands.
</details>

## 📦 How to use:
You need to have [node.js](https://nodejs.org/en) installed.

Clone the project.

Install required packages into the project:
  ```bash
npm install
  ```
First, you need to create a bot in the [discord developer portal](https://discord.com/developers/applications).

Copy the bot `TOKEN`.

Add the bot to your server.

Now copy the .env.example file to **.env** file to the project:
  ```.bash
copy .env.example .env
  ```

Add the bot `TOKEN` to the **.env** file:

  ```.env
TOKEN=EXAMPLE01234TOKEN
CLIENT_ID=
GUILD_ID=
  ```
 
Now add the **CLIENT_ID** (your discord user's id) and **GUILD_ID** (your server's id) to the **.env** file.

You can get the **CLIENT_ID** with a right click on you user profile on discord and clicking on **COPY ID**. 
The *GUILD_ID* with a right click on you server on discord and clicking on **COPY ID**. 
If you are not seeing the **COPY ID** button, activate *development mode* with this steps: **discord configs -> advanced -> development mode**.

The `.env` file should be like this example:
  ```.env
TOKEN=EXAMPLE01234TOKEN
CLIENT_ID=01234567890
GUILD_ID=09355i2310
  ```
  
Now, run the commands:
   ```.js
npm start
  ```
  
## Author:
- [Katson](https://github.com/katson1)
