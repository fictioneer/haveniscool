    document.addEventListener('DOMContentLoaded', function() {
document.getElementById("username").addEventListener("input", function () {
            document.getElementById("output").innerText = submit();
        });

        document.getElementById("redo").addEventListener("click", function () {
            document.getElementById("output").innerText = submit();
        });

        document.getElementById("range").addEventListener("input", function () {
            document.getElementById("output").innerText = submit();
        });

        let colonTags = [": the long pond studio sessions", ": the saltbox house chapter", ": the sleepless nights chapter", ": the escapism chapter", ": the yeah I showed up at your party chapter", ": the “dropped your hand while dancing” chapter", ": the “forever is the sweetest con” chapter", ": the “ladies lunching” chapter", ": The Halfway Out The Door Chapter", ": The Kissing In The Rain Chapter", ": The I Remember What You Said Last Night Chapter", ": The From The Vault Chapter", ": Could You Be The One Chapter", ": She Wrote A Song About Me Chapter", ": The Slow Motion Chapter"]
        let dashes = ["- Recorded at Long Pond Studios", "- Live from the 2020 Academy of Country Music Awards", "- US Version", "- Original Version", "- From “One Chance” Soundtrack", "- Recorded at The Tracking Room Nashville", ""]
        let normal = ["(Taylor’s Version)", "(from the vault)", "(10 Minute Version)", "(dancing witch version)", "(Acoustic Version)", "(cabin in candlelight version)", "(lonely witch version)", "(the witch collection)", "(moonlit witch version)", "(original version)", "(Pop Version)", "(Sad Girl Autumn Version)", "(Old Timey Version)", "(Remix)", "(R3hab Remix)", "(BloodPop® Remix)", "(Elvira remix)", "(Sawyr And Ryan Tedder Mix)", "(Seeb Remix)", "(Clean Bandit Remix)", "(First Dance Remix)", "(CSI Remix)", "(Pop Mix)", "(Digital Dog Remix)", "(Elvira remix)", "(90’s trend remix)", "(Fat Max G Remix)", "(Remixes)", "(ILLENIUM Remix)", "(Felix Jaehn Remix)", "(Live From Paris)", "(Live from the 2020 Academy of Country Music Awards)", "(Recorded Live at the 2019 iHeartRadio Jingle Ball)", "(feat. Maren Morris)", "(feat. Taylor Swift)", "(feat. Bleachers)", "(feat. The Chicks)", "(feat. Brendon Urie of Panic At The Disco)", "(feat. Bon Iver)", "(feat. HAIM)", "(feat. The National)", "(feat. Colbie Caillat)", "(Piano Version)", "(feat. Maren Morris)", "(feat. Keith Urban)", "(feat. Gary Lightbody of Snow Patrol)", "(feat. Ed Sheeran)", "(feat. Phoebe Bridgers)", "(feat. Chris Stapleton)", "(feat. Lana Del Ray)", "(3am Edition)", "(feat. Ice Spice)", "(feat. Fall Out Boy)", "(feat. Hayley Williams)", "(Featured in Miss Americana)", "(from the Disney+ special)", "(The Til Dawn Edition)", "(The Short Film)", "(From The Motion Picture “Where The Crawdads Sing”)", "(Deluxe Edition)"]
        function getRandomFromArray(array, count) {
            const shuffledArray = array.slice().sort(() => Math.random() - 0.5);
            return shuffledArray.slice(0, count);
        }

        function submit() {
            let intensity = document.getElementById("range").value;
            let tags = [];

            if (intensity > 33 && intensity < 66) {
                tags.push(getRandomFromArray([colonTags, dashes][Math.floor(Math.random() * 2)], 1));
            } else if (intensity > 66) {
                tags = tags.concat(getRandomFromArray(colonTags, 1));
                tags = tags.concat(getRandomFromArray(dashes, 1));
            }

            let normalCount = Math.round((normal.length / 100) * intensity);
            tags = tags.concat(getRandomFromArray(normal, normalCount));

            let name = document.getElementById("username").value || "Haven";
            let total = name + " " + tags.join(" ");
            return total;
        }

        document.getElementById("output").innerText = submit();
    });
