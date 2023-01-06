# Rails Web Debug
Rails view inspector in the style of React's Devtools

![image](https://user-images.githubusercontent.com/52800852/210931761-8c24a156-eadd-4083-b106-dce8cb16d41b.png)

### Early Alpha
This extension is still in very early stages and many things don't work.
What does work is a list of HTML elements / comments / text nodes and partials based on `config.action_view.annotate_rendered_view_with_filenames`'s comments.

## Usage

The Rails server needs to have `config.action_view.annotate_rendered_view_with_filenames` set to `true` in `config/environments/development.rb`.
The line is usually already there, commented out at the bottom of the file.

Once this is set, restart the server in dev mode and load it up in your browser. In the dev tools, there should be a "Rails" tab.

## Building

You will need `pnpm` v7 and `node` v18 installed. The build has only been tested on Linux (specifically Fedora 37) but it should work on MacOS and may work on Windows.

In the root of the repository run `pnpm install` and then `pnpm run build`.

The build output is placed in the `dist` directory, this can then be zipped with `pnpm run package` to zip the extension (the zip will also go in the `dist` directory as `rails_web_debug-X.X.X.zip`).
