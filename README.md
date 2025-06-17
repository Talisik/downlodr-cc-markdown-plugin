# CC to Markdown Plugin

## Overview

The CC to Markdown Plugin automatically detects and converts closed caption files (.vtt) from your downloaded videos into clean, readable text. This essential tool transforms raw subtitle files into well-formatted content perfect for notes, summaries, or documentation.

With intelligent formatting that removes timestamps, speaker labels, and technical markup, this plugin delivers clean, structured text that's ideal for studying video content, creating transcripts, or extracting key information from educational materials. Whether you're a student, content creator, or professional, CC to Markdown streamlines the process of converting video captions into usable text.

## Features

- **Automatic caption detection** - Finds .vtt (WebVTT) files in your downloaded video directories
- **Smart text cleaning**:
  - Removes timestamps and speaker labels
  - Strips HTML tags and VTT-specific formatting
  - Filters out metadata annotations like [Music] or [Applause]
  - Converts HTML entities to readable text
- **Clean output formatting** - Produces well-structured, readable text documents
- **One-click conversion** - Convert captions directly from the download context menu
- **Custom save locations** - Choose where to save your converted text files
- **Real-time preview** - See if captions are available before conversion
- **Progress tracking** - Visual progress indicator during conversion
- **Success notifications** - Confirmation when conversion is complete with quick folder access

## Installation

1. Ensure you have Downlodr version 1.3.4 or higher installed
2. Download the CC to Markdown Plugin package
3. Extract the folder to your preferred location
4. Click the "Plugin" button in the top left corner of the Task Bar window
5. Click the "Add Plugin" button to locate the folder you extracted the plugin to and press "Select Folder"
6. The plugin will be loaded automatically on startup

**Note: Make sure that the folder includes the `index.js` file and `manifest.json` file**

## Usage

1. Download a video with captions using Downlodr
2. Once download is complete, right click on the video and select "Convert CC to Markdown" from the context menu
3. A conversion panel will appear showing:
   - Video details and caption availability status
   - Output format selection (currently Text format)
   - Save location picker
4. If captions are detected:
   - Choose your desired save location using the folder button
   - Click "Convert" to start the process
   - Monitor the progress bar during conversion
5. Upon completion, a success popup will appear with:
   - Confirmation message
   - File save path (click to open containing folder)

## Supported Formats

### Input
- **WebVTT (.vtt)** - Standard web video text track format used by most video platforms

### Output
- **Text (.txt)** - Clean, readable plain text format perfect for notes and documentation

## Technical Details

The plugin performs the following processing:

- **Caption Detection**: Scans video directories for associated .vtt files
- **Content Parsing**: Intelligently processes WebVTT format to extract text content
- **Text Cleaning**: 
  - Removes timestamp markers (e.g., "00:00:00.000 --> 00:00:03.000")
  - Strips HTML tags and VTT styling elements
  - Filters metadata annotations and speaker identifiers
  - Converts HTML entities to readable characters
- **Output Generation**: Creates well-formatted text documents with proper spacing and structure
- **File Management**: Handles file I/O operations with error checking and user feedback

## Requirements

- Downlodr v1.3.4+
- Videos with embedded or external WebVTT (.vtt) caption files
- Write permissions to the selected output directory

## Troubleshooting

### No Captions Available
If you see "No Captions Available":
- Ensure your video has closed captions enabled during download
- Check that .vtt files are present in the video directory
- Check that .vtt files contains valid text data inside
- Try downloading the video again with caption options enabled

### Conversion Issues
- Verify you have write permissions to the selected output folder
- Ensure sufficient disk space for the output file
- Check that the original .vtt file isn't corrupted or empty

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

Developed by Downlodr

## Version History

- 1.0.0 - Initial release
  - WebVTT to text conversion
  - Smart text cleaning and formatting
  - Context menu integration
  - Progress tracking and notifications
  - Custom save location selection

- 2.0.0 - Dark Mode and Light Mode Release
  - Adjusted Show Panel logic and styling to allow dark mode and light mode application
  - Added Docx conversion and import

## Privacy Note

This plugin processes caption files locally on your device. No data is transmitted to external servers during the conversion process.

## Contributing

Interested in contributing to this plugin? Please submit issues and feature requests through the appropriate channels or contact the development team. 