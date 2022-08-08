# Brokering Additive Manufacturing Living Lab WebApp (Trial 2)

This is the 2nd trial of creating a webapp for our Brokering Additive Manufacturing agent-based manufacturing platform for our living lab experiments.

Taking learnings from trial one, we have moved to a new stack using svelte to build the webapp and have refined the interface to handle more types of printer with different connectivity and gcode flavours.

## Getting Started

To run the pre-compiled version of the website locally, first clone the repository to your computer

```
git clone https://github.com/jamesgopsill/svelte-living-lab.git
```

Then `cd` into the `docs` directory and, assuming you have python installed on your computer, you can run:

```
python -m http.server
```

Then go to your browser and enter `http://localhost:8000` into your address bar and you will be taken the website.




## For Development

```
git clone https://github.com/jamesgopsill/svelte-living-lab.git
```

```
pnpm install
```

```
pnpm start
```