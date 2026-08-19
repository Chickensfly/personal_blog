---
title: The Whistleblower
date: 2026-07-8
tags: [project log]
---

![Title Card Image](/whistleblower_title.png)

Last Wednesday, I wrapped up three days of nearly uninterrupted work to present my first short film, *The Whistleblower*. A last minute entry to the [Small File Media Festival](https://smallfile.ca/about/), I initially took it on as a challenge since I had some free time and wanted to give back to the format of film somehow. I already love movies as-is and I understand well that first-hand experience in any domain only aids in one's appreciation of the respective medium. I've made plenty of video projects for school in the past and had a good time doing so. I figured this was the perfect opportunity to take the next step up to forget the rubric and work on my own terms. Only limited by my ambition, I made some brave decisions that have certainly paid off as learning experiences if nothing else.

With the gimmick of the festival being the requirement to keep the video bitrate to 1.44 MB/min or under (1080p video averages ~60 MB/min), I used it as my main creative constraint while planning the film. Before I had even begun to think about writing a script, I started working on a compression tool capable of creating a unique visual style. Inspired by [The Return of the Obra Dinn](https://store.steampowered.com/app/653530/Return_of_the_Obra_Dinn/), I wanted to complement the ethos of the festival with a lo-fi dithered look.

## Dithering

I anticipated dithering to be a lot more difficult than it turned out to be. The unique style of *The Return of the Obra Dinn* was fresh in my mind after encountering a [blog post](https://forums.tigsource.com/index.php?topic=40832.msg1363742#msg1363742) detailing the work it took to make the final product look polished and intelligible with a 1-bit palette. Turns out, working with 2D images makes the work much simpler. 

Dithering is dependent on static, pixel-by-pixel matrix-based manipulations. My search uncovered two promising algorithms - Floyd-Steinberg and Atkinson. They differ in the matrices that are used to calculate the final composition. The underlying process is the same.

First, a palette is determined with set RGB values. For my film, I used a 4-bit palette (16 colors) which is derived using Pillow's median-cut quantization functionality and changes dynamically from shot-to-shot. The dithering algorithm cycles through the entire canvas of pixels and, for each one, calculates the difference between its RGB values and the closest color available in the palette. The pixel resolves to that closest palette color while the difference is kept and passed along to neighboring pixels. It is here where the two algorithms differ.

Floyd-Steinberg is as follows:

<table class="kernel">
  <tr>
    <td>-</td>
    <td class="current">^</td>
    <td>7/16</td>
  </tr>
  <tr>
    <td>3/16</td>
    <td>5/16</td>
    <td>1/16</td>
  </tr>
</table>

*Whereas ^ is the current pixel*

Meaning that 7/16th of the error is added to the right neighboring pixel, 3/16th to the bottom left, and so on. This way, the entire magnitude of the error is preserved as all factors add to 1. Atkinson differs by neglecting to pass 1/4 of the error forward. 

<table class="kernel">
  <tr>
    <td>-</td>
    <td class="current">^</td>
    <td>1/8</td>
    <td>1/8</td>
  </tr>
  <tr>
    <td>1/8</td>
    <td>1/8</td>
    <td>1/8</td>
    <td>-</td>
  </tr>
  <tr>
    <td>-</td>
    <td>1/8</td>
    <td>-</td>
    <td>-</td>
  </tr>
</table>

To test the visual acuity of each approach, I used the *Fight Club* trailer as a stress test to simulate real world performance. Below, you can see how Floyd-Steinberg's error preservation allows for better background detail recall at the price of poorly-defined foreground features. While this could be a worthwhile tradeoff for converting existing media, I have the luxury of creating the entire film from scratch. I found the Atkinson output to be more visually appealing and so I chose to stick with it and make a mental note to keep background elements at a minimum.

![Comparison of different dithering outputs on a Fight Club frame](/whistleblower_dither_compare.png)

As it turns out though, dithering is actually more demanding memory-wise. Most video file formats assume the presence of gradients as most camera capture uses an 8-bit palette which is much larger than the output of my dithering program (4-bit). Video is stored as movement of these gradients, with each pixel being assigned a motion vector that describes positional change from one frame to the next. Dithered video causes these vectors to become much more chaotic, increasing storage demand. 

Luckily, this effect is mitigated by the downscaled video which is then passed to ffmpeg's robust encoder as the final step of the pipeline. Ultimately, it is a counterproductive solution for the compression of input video, but it looks great and deliciously on-theme.

## Script

Now, I had to write a script. An incredibly daunting task when the domain of possibilities is so unfathomably enormous. Once again, I fixated on the constraints that I did have. I had a good sense of the visual identity of the film and also I had three days to do it all. With the video undergoing such aggressive processing, I figured the sins of subpar special effects or animation work could be easily hidden.

I took inspiration from a short film from Youtube about the austistic experience which used movies clips and tropes to deliver a really elegantly blunt narrative. I have since been unable to find this film again despite my best efforts, but it was memorable enough to continue to be a touchstone during script drafting. I was also inspired by the ridiculousness of heavenly experience as described by NDE accounts that are adamant on their veracity. This was also the premise for a bit in Dan Licata's *For the Boys* standup special.

The final product took advantage of my limited resources by having the entire piece be narrated, which also sidesteps the difficulties of setting up a nuanced plot within a tight timeframe. Scenes would be described and play out as animated sequences.

While the script itself gave me much trouble, it was a result of my perfectionism. I had little trust in what I know now - a script can be both ruined and salvaged through visual development. 

## Animation

![The ungodly raw composition of the hallway scene](/whistleblower_hall.png)

I opted to do everything in Blender. While I had experience working in Blender before, I had never managed lighting and camera elements as in-depth as I needed to for this project. It was a tremendous test of my learning ability as models would have to come together extremely quickly, textures and all. 

![The racing rig was one of the most irregular models](/whistleblower_rigs.png)

I have no insightful input on the Blender work, to be completely honest. Blender is a deep rabbit hole where there are a million ways to produce the same product. I am convinced I only know the worst methods. It feels a little wrong to pass on ill-fated advice. 

What I can say is that this activity was a great exercise in frustration management. Nothing is as intuitive as it may initially appear to be. Something so simple as moving the limbs of a character requires so much care and attention to detail that rushing it just leads to more work further down the line. I had to think and create with respect to an extra dimension. 

Modeling and animation took the vast majority of production time as I was sat for 10+ hours a day trying to fight my perfectionism to move onto the next scene. Once that was done, the editing process took another 3 hours. I am fairly familiar with Final Cut Pro, which I used to assemble everything. This part was a walk in the park in comparison. During the entire process, I desperately wanted to go outside. It was unfortunate that the day after I had submitted it, it was raining. Pafooey.

The final product is currently under review by the Small File Media Festival. If accepted, it will be screened at the Cinematheque in downtown Vancouver and available online at their site. Whether or not it sees the big screen, I am proud of the final product and appreciative of my returns from this trial by fire.

*Update 8/19/2026: The film was officially selected and will be screened live at The Cinematheque in downtown Vancouver on October 17th-18th. Afterwards, it will be available online at the [Small File Media Festival website](https://www.smallfile.ca).*
