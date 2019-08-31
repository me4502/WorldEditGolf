import React from "react";
import { Nav } from "./Nav";
import { storiesOf } from "@storybook/react";
import { Leaderboard, LeaderboardEntry } from "./Leaderboard";

storiesOf("Leaderboard", module).add("Default", () => (
  <Leaderboard>
    <LeaderboardEntry
      avatar={"https://avatars.io/twitter/dstein64/small"}
      strokes={21}
      created="Tuesday 20th, 2019"
      githubId={"bennetthardwick"}
      name={"Bennett Hardwick"}
    >
      Hey
    </LeaderboardEntry>
    <LeaderboardEntry
      avatar={"https://avatars.io/twitter/dstein64/small"}
      strokes={12}
      created="Tuesday 20th, 2019"
      githubId={"johnny"}
      name={"John Johnson"}
    >
      Hey
    </LeaderboardEntry>
  </Leaderboard>
));
