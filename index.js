const ccToMarkdownPlugin = {
  id: 'cctomarkdown',
  name: 'CC to Markdown',
  version: '2.0.0',
  description: 'Convert video captions to document formats',
  author: 'Downlod',
  icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M1.77778 0C1.28889 0 0.888889 0.18 0.524444 0.57C0.177778 0.96 0 1.44 0 2V14C0 14.56 0.177778 15.04 0.524444 15.43C0.888889 15.82 1.28889 16 1.77778 16H14.2222C14.6667 16 15.1111 15.81 15.4578 15.41C15.8222 15 16 14.53 16 14V2C16 1.47 15.8222 1 15.4578 0.59C15.1111 0.19 14.6667 0 14.2222 0H1.77778ZM1.33333 1.5H14.6667V14.5H1.33333V1.5ZM3.55556 5C3.28889 5 3.08444 5.09 2.91556 5.28C2.74667 5.47 2.66667 5.7 2.66667 6V10C2.66667 10.3 2.74667 10.53 2.91556 10.72C3.08444 10.91 3.28889 11 3.55556 11H6.22222C6.46222 11 6.66667 10.91 6.85333 10.72C7.03111 10.53 7.11111 10.3 7.11111 10V9H5.77778V9.5H4V6.5H5.77778V7H7.11111V6C7.11111 5.7 7.03111 5.47 6.85333 5.28C6.66667 5.09 6.46222 5 6.22222 5H3.55556ZM9.77778 5C9.53778 5 9.33333 5.09 9.14667 5.28C8.96889 5.47 8.88889 5.7 8.88889 6V10C8.88889 10.3 8.96889 10.53 9.14667 10.72C9.33333 10.91 9.53778 11 9.77778 11H12.4444C12.7111 11 12.9156 10.91 13.0844 10.72C13.2533 10.53 13.3333 10.3 13.3333 10V9H12V9.5H10.2222V6.5H12V7H13.3333V6C13.3333 5.7 13.2533 5.47 13.0844 5.28C12.9156 5.09 12.7111 5 12.4444 5H9.77778Z"/></svg>',

  menuItemIds: [],
  taskBarItemIds: [],

  // Conversion methods
  converters: {
    vtt: {
      toMarkdown: (content) => {
        if (!content) return '# No captions available\n\n';

        const lines = content.split('\n');
        let output = [];
        let currentText = '';
        let inCue = false;

        for (let line of lines) {
          line = line.trim();

          // Skip empty lines
          if (!line) {
            if (currentText) {
              output.push(currentText.trim());
              currentText = '';
            }
            continue;
          }

          // Skip WEBVTT header and style blocks
          if (line.startsWith('WEBVTT') || line.startsWith('STYLE') || line.startsWith('NOTE')) {
            continue;
          }

          // Check for timestamp lines (e.g., "00:00:00.000 --> 00:00:03.000")
          if (line.includes('-->')) {
            if (currentText) {
              output.push(currentText.trim());
              currentText = '';
            }
            inCue = true;
            continue;
          }

          // Process text lines within a cue
          if (inCue) {
            // Remove HTML-like tags (e.g., <c>, </c>) and other markup
            let cleanedLine = line.replace(/<[^>]+(>|$)/g, '');
            // Remove any additional VTT-specific formatting or annotations
            cleanedLine = cleanedLine.replace(/&[^;]+;/g, ''); // Remove HTML entities if any
            // Skip lines that are just metadata or empty after cleaning
            if (cleanedLine && !cleanedLine.match(/^\[.*\]$/)) { // Skip lines like [Music] or [Applause] if desired
              currentText += cleanedLine + ' ';
            }
          }
        }

        // Add the last piece of text if exists
        if (currentText) {
          output.push(currentText.trim());
        }

        // Join the output with spaces or newlines for readability
        if (output.length === 0) {
          return '# No captions available\n\n';
        }

        // Format as a readable markdown document
        return `# Video Captions\n\n${output.join('\n\n')}\n`;
      },

      toPlainText: (content) => {
        if (!content) return 'No captions available\n\n';

        const lines = content.split('\n');
        let output = [];
        let currentText = '';
        let inCue = false;

        for (let line of lines) {
          line = line.trim();

          // Skip empty lines
          if (!line) {
            if (currentText) {
              output.push(currentText.trim());
              currentText = '';
            }
            continue;
          }

          // Skip WEBVTT header and style blocks
          if (line.startsWith('WEBVTT') || line.startsWith('STYLE') || line.startsWith('NOTE')) {
            continue;
          }

          // Check for timestamp lines (e.g., "00:00:00.000 --> 00:00:03.000")
          if (line.includes('-->')) {
            if (currentText) {
              output.push(currentText.trim());
              currentText = '';
            }
            inCue = true;
            continue;
          }

          // Process text lines within a cue
          if (inCue) {
            // Remove HTML-like tags (e.g., <c>, </c>) and other markup
            let cleanedLine = line.replace(/<[^>]+(>|$)/g, '');
            // Remove any additional VTT-specific formatting or annotations
            cleanedLine = cleanedLine.replace(/&[^;]+;/g, '');
            // Skip lines that are just metadata or empty after cleaning
            if (cleanedLine && !cleanedLine.match(/^\[.*\]$/)) { // Skip lines like [Music] or [Applause]
              currentText += cleanedLine + ' ';
            }
          }
        }

        // Add the last piece of text if exists
        if (currentText) {
          output.push(currentText.trim());
        }

        // Join the output for plain text
        return output.length > 0 ? output.join('\n') : 'No captions available';
      },
    },
  },

  // Utility to clean up text (if needed elsewhere)
  cleanText: (text) => {
    let output = text;
    // Remove HTML tags
    output = output.replace(/<[^>]+(>|$)/g, '');
    // Remove HTML entities
    output = output.replace(/&[^;]+;/g, '');
    // Remove multiple spaces
    output = output.replace(/\s+/g, ' ');
    // Trim leading/trailing spaces
    for (let line of output.split('\n')) {
      if (line.trim()) {
        output.push(line.trim());
      }
    }
    return output.join(' ');
  },

  /**
   * Initialize the plugin
   * @param {PluginAPI} api - The plugin API provided by Downlodr
   */
  async initialize(api) {
    this.api = api;
    
    // Check DOCX availability
    this.docxAvailable = await this.checkDocxAvailability();
    console.log('DOCX availability:', this.docxAvailable);
    
    // Register a menu item for CC to Markdown conversion
    const menuItemId = await api.ui.registerMenuItem({
      id: 'cc-to-document',
      label: 'CC to Markdown',
      icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M1.77778 0C1.28889 0 0.888889 0.18 0.524444 0.57C0.177778 0.96 0 1.44 0 2V14C0 14.56 0.177778 15.04 0.524444 15.43C0.888889 15.82 1.28889 16 1.77778 16H14.2222C14.6667 16 15.1111 15.81 15.4578 15.41C15.8222 15 16 14.53 16 14V2C16 1.47 15.8222 1 15.4578 0.59C15.1111 0.19 14.6667 0 14.2222 0H1.77778ZM1.33333 1.5H14.6667V14.5H1.33333V1.5ZM3.55556 5C3.28889 5 3.08444 5.09 2.91556 5.28C2.74667 5.47 2.66667 5.7 2.66667 6V10C2.66667 10.3 2.74667 10.53 2.91556 10.72C3.08444 10.91 3.28889 11 3.55556 11H6.22222C6.46222 11 6.66667 10.91 6.85333 10.72C7.03111 10.53 7.11111 10.3 7.11111 10V9H5.77778V9.5H4V6.5H5.77778V7H7.11111V6C7.11111 5.7 7.03111 5.47 6.85333 5.28C6.66667 5.09 6.46222 5 6.22222 5H3.55556ZM9.77778 5C9.53778 5 9.33333 5.09 9.14667 5.28C8.96889 5.47 8.88889 5.7 8.88889 6V10C8.88889 10.3 8.96889 10.53 9.14667 10.72C9.33333 10.91 9.53778 11 9.77778 11H12.4444C12.7111 11 12.9156 10.91 13.0844 10.72C13.2533 10.53 13.3333 10.3 13.3333 10V9H12V9.5H10.2222V6.5H12V7H13.3333V6C13.3333 5.7 13.2533 5.47 13.0844 5.28C12.9156 5.09 12.7111 5 12.4444 5H9.77778Z"/></svg>',
      context: 'download',
      onClick: (contextData) => this.showCCPanel(contextData)
    });
    
    this.menuItemIds = [menuItemId];
    
    console.log('CC to Markdown plugin initialized');
  },

  /**
   * Show CC conversion panel
   * @param {Object} contextData - Context data from the app
   */
  async showCCPanel(contextData) {
    try {
      // File size formatter
      const formatFileSize = (bytes) => {
        if (!bytes) return '—';
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
      };

      // Video duration formatter
      const formatDuration = (seconds) => {
        if (!seconds) return '—';
        
        const totalSeconds = Math.floor(seconds);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const remainingSeconds = totalSeconds % 60;
        
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedSeconds = remainingSeconds.toString().padStart(2, '0');
        
        if (hours > 0) {
          return `${hours}:${formattedMinutes}:${formattedSeconds}`;
        } else {
          return `${formattedMinutes}:${formattedSeconds}`;
        }
      };

      console.log('Initial contextData received:', contextData);
      
      // Handle both single item and array formats
      let downloadItems = [];
      
      if (Array.isArray(contextData)) {
        downloadItems = contextData.map(item => {
          if (item.id) {
            return {
              videoUrl: item.id.videoUrl,
              location: item.id.location,
              name: this.sanitizeHtml(this.extractNameFromLocation(item.id.location)),
              ext: item.id.ext,
              format:  item.id.ext || "MP4 (H.264)",
              duration: item.id.duration || "Unknown",
              size: item.id.size || "Unknown",
              captionLocation: item.id.captionLocation || "Unknown",
            };
          }
          return null;
        }).filter(item => item !== null);
      } else {
        if (contextData && contextData.videoUrl) {
          downloadItems = [{
            videoUrl: contextData.videoUrl,
            location: contextData.location,
            name: this.sanitizeHtml(contextData.name || this.extractNameFromLocation(contextData.location)),
            ext: contextData.ext,
            format: contextData.ext || "MP4 (H.264)",
            duration: formatDuration(contextData.duration) || "Unknown",
            size: formatFileSize(contextData.size) || "Unknown",
            captionLocation: contextData.captionLocation || "Unknown",
          }];
        }
      }

      
      if (downloadItems.length === 0) {
        console.error('No valid download items found in context data', contextData);
        this.api.ui.showNotification({
          title: 'Error',
          message: 'No valid downloads selected',
          type: 'error',
          duration: 3000
        });
        return;
      }

      // Just use the first item for now
      const download = downloadItems[0];
      console.log('Processed download item:', download);
      
      const panelId = `cc_panel_${Date.now()}`;

      // Only supporting TXT now
      const currentFormat = 'txt';
      console.log(download.location);
      // Default save path
      const defaultPath = `${download.location || this.api.system.getDefaultDownloadPath() || "C:\\Downloads\\"}${download.name.replace(/\.[^/.]+$/, "")}.${currentFormat}`;
      
      // Check if captions exist
      const captionContent = await this.getCaptionsForVideo(download.videoUrl, download.captionLocation);
      const hasCaptionFile = !!captionContent && captionContent.trim() !== '';
      
      console.log('Caption file check result:', hasCaptionFile ? 'Found' : 'Not found');
      
      // Format options based on DOCX availability
      const formatOptionsHtml = `
        <div class="format-options">
          <div class="format-option selected" data-format="txt" 
               onclick="selectFormat(this, 'txt')">
            <div class="format-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M14 2V8H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16 13H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16 17H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M10 9H9H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="format-name">TXT</div>
          </div>
          <div class="format-option ${this.docxAvailable ? '' : 'disabled'}" data-format="docx" 
               ${this.docxAvailable ? 'onclick="selectFormat(this, \'docx\')"' : 'title="DOCX package not available - run: npm install docx"'}>
            <div class="format-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M14 2V8H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16 13H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16 17H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M10 9H9H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="format-name">DOCX${this.docxAvailable ? '' : ' (N/A)'}</div>
          </div>
        </div>
      `;
      
      // Panel message handler
      const messageHandler = async (event) => {
        if (!event.data || typeof event.data !== 'object' || event.data.panelId !== panelId) return;
        
        console.log('Received message from panel:', event.data);
        
        switch (event.data.action) {
          case 'format-select':
            console.log('Format selected:', event.data.format);
            // Hide success popup when format changes
            window.postMessage({
              panelId: panelId,
              action: 'hide-success-popup'
            }, '*');
            
            document.querySelectorAll('iframe').forEach(iframe => {
              try {
                iframe.contentWindow.postMessage({
                  panelId: panelId,
                  action: 'hide-success-popup'
                }, '*');
              } catch (err) {
                console.log('Could not send to iframe:', err);
              }
            });
            break;

            case 'browse':
              console.log('Browse button clicked, using format:', event.data.format || currentFormat);
              try {
                const result = await this.showSaveFileDialog(download, event.data.format || currentFormat);
                
                if (result) {
                  console.log('Selected save path:', result.filePath);
                  
                  // Make sure we have a string
                  const filePathString = typeof result.filePath === 'object' ? 
                    (result.filePath.toString() || '') : 
                    (result.filePath || '');
                  
                  console.log('Sending update message with path:', filePathString);
                  
                  // Try multiple ways to reach the panel
                  window.postMessage({
                    panelId: panelId,
                    action: 'update-save-path',
                    path: filePathString
                  }, '*');
                  
                  document.querySelectorAll('iframe').forEach(iframe => {
                    try {
                      iframe.contentWindow.postMessage({
                        panelId: panelId,
                        action: 'update-save-path',
                        path: filePathString
                      }, '*');
                    } catch (err) {
                      console.log('Could not send to iframe:', err);
                    }
                  });
                  
                  if (window.parent !== window) {
                    window.parent.postMessage({
                      panelId: panelId,
                      action: 'update-save-path',
                      path: filePathString
                    }, '*');
                  }
                  
                  this.api.ui.showNotification({
                    title: 'Location Selected',
                    message: `Save location: ${filePathString}`,
                    type: 'default',
                    duration: 3000
                  });
                }
              } catch (error) {
                console.error('Error showing file dialog:', error);
              }
              break;
            
          case 'cancel':
            // Clean up
            window.removeEventListener('message', messageHandler);
            await this.api.ui.closePluginPanel(panelId);
            break;
            
          case 'convert':
            // Do the conversion
            try {
              const format = event.data.format || 'txt';
              let savePath = event.data.savePath;
              
              // Generate default path if needed
              if (!savePath || savePath === defaultPath) {
                console.log('No custom save path, generating default path for format:', format);
                
                // Clean filename
                let baseName = download.name || 'captions';
                baseName = baseName.replace(/\.[^/.]+$/, ""); // Remove extension
                baseName = baseName.replace(/\.(mp4|mkv|avi|mov|wmv|flv|webm|m4v)$/i, ""); // Remove video extensions
                
                // Get directory
                let directory = download.location || this.api.system?.getDefaultDownloadPath() || "C:\\Downloads\\";
                
                // Extract directory from file path if needed
                if (directory && (directory.includes('.mkv') || directory.includes('.mp4') || directory.includes('.avi') || directory.includes('.mov') || directory.includes('.wmv') || directory.includes('.flv') || directory.includes('.webm') || directory.includes('.m4v'))) {
                  const lastSeparatorIndex = Math.max(directory.lastIndexOf('\\'), directory.lastIndexOf('/'));
                  if (lastSeparatorIndex !== -1) {
                    directory = directory.substring(0, lastSeparatorIndex + 1);
                  }
                  console.log('Extracted directory from file path:', directory);
                }
                
                // Ensure directory ends with separator
                const dirPath = directory.endsWith('\\') || directory.endsWith('/') ? directory : directory + '\\';
                
                // Create filename with correct extension
                const filename = `${baseName}.${format}`;
                savePath = `${dirPath}${filename}`;
                
                console.log('Generated default save path:', savePath);
                console.log('Base name:', baseName);
                console.log('Directory:', dirPath);
                console.log('Filename:', filename);
              }
              
              console.log('Converting to format:', format);
              console.log('Final save path:', savePath);

              await this.handleConvertAction(download, format, savePath, panelId);
              
              // Show success popup
              window.postMessage({
                panelId: panelId,
                action: 'show-success-popup',
                savePath: savePath,
                format: format.toUpperCase()
              }, '*');
              
              document.querySelectorAll('iframe').forEach(iframe => {
                try {
                  iframe.contentWindow.postMessage({
                    panelId: panelId,
                    action: 'show-success-popup',
                    savePath: savePath,
                    format: format.toUpperCase()
                  }, '*');
                } catch (err) {
                  console.log('Could not send to iframe:', err);
                }
              });
              
            } catch (error) {
              console.error('Error converting captions:', error);
              
              this.api.ui.showNotification({
                title: 'Conversion Error',
                message: error.message || 'Failed to convert captions',
                type: 'error',
                duration: 3000
              });
            }
            break;

          case 'show-no-vtt-notification':
            this.api.ui.showNotification({
              title: 'No Captions Available',
              message: 'No caption file found. Please make sure caption files exist in the same folder.',
              type: 'error',
              duration: 3000
            });
            break;

          case 'open-folder':
            try {
              const fullPath = event.data.savePath;
              const lastSeparatorIndex = Math.max(fullPath.lastIndexOf('\\'), fullPath.lastIndexOf('/'));
              const directory = lastSeparatorIndex !== -1 ? fullPath.substring(0, lastSeparatorIndex + 1) : '';
              
              await window.downlodrFunctions.openFolder(directory, fullPath);
              console.log('Opening folder:', fullPath);
            } catch (folderError) {
              console.error('Error opening folder:', folderError);
              this.api.ui.showNotification({
                title: 'Error',
                message: 'Could not open folder',
                type: 'error',
                duration: 3000
              });
            }
            break;
        }
      };
      
      window.addEventListener('message', messageHandler);
      
      // Show the panel
      const panelResult = await this.api.ui.showPluginSidePanel({
        title: "CC to Markdown",
        icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M1.77778 0C1.28889 0 0.888889 0.18 0.524444 0.57C0.177778 0.96 0 1.44 0 2V14C0 14.56 0.177778 15.04 0.524444 15.43C0.888889 15.82 1.28889 16 1.77778 16H14.2222C14.6667 16 15.1111 15.81 15.4578 15.41C15.8222 15 16 14.53 16 14V2C16 1.47 15.8222 1 15.4578 0.59C15.1111 0.19 14.6667 0 14.2222 0H1.77778ZM1.33333 1.5H14.6667V14.5H1.33333V1.5ZM3.55556 5C3.28889 5 3.08444 5.09 2.91556 5.28C2.74667 5.47 2.66667 5.7 2.66667 6V10C2.66667 10.3 2.74667 10.53 2.91556 10.72C3.08444 10.91 3.28889 11 3.55556 11H6.22222C6.46222 11 6.66667 10.91 6.85333 10.72C7.03111 10.53 7.11111 10.3 7.11111 10V9H5.77778V9.5H4V6.5H5.77778V7H7.11111V6C7.11111 5.7 7.03111 5.47 6.85333 5.28C6.66667 5.09 6.46222 5 6.22222 5H3.55556ZM9.77778 5C9.53778 5 9.33333 5.09 9.14667 5.28C8.96889 5.47 8.88889 5.7 8.88889 6V10C8.88889 10.3 8.96889 10.53 9.14667 10.72C9.33333 10.91 9.53778 11 9.77778 11H12.4444C12.7111 11 12.9156 10.91 13.0844 10.72C13.2533 10.53 13.3333 10.3 13.3333 10V9H12V9.5H10.2222V6.5H12V7H13.3333V6C13.3333 5.7 13.2533 5.47 13.0844 5.28C12.9156 5.09 12.7111 5 12.4444 5H9.77778Z"/></svg>',
        content: `
          <style>
            .cc-panel {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              color: var(--text-primary);
              display: flex;
              flex-direction: column;
              height: 100%;
              position: absolute;
              top: 0;
              bottom: 0;
              left: 0;
              right: 0;
              overflow: hidden;
            }
            
            .panel-content {
              flex: 1;
              overflow-y: auto;
              padding: 15px;
              padding-bottom: 20px;
            }
            
            .panel-footer {
              background: var(--bg-secondary);
              padding: 10px 20px;
              border-top: 1px solid var(--border-primary);
              flex-shrink: 0;
            }
            
            .cc-panel h3 {
              font-size: 13px;
              font-weight: 600;
              margin-top: 10px;
              margin-bottom: 8px;
              color: var(--text-primary);
            }
            .file-info {
              margin-bottom: 10px;
              background-color: var(--bg-secondary);
              border: 1px solid var(--border-primary);
              padding: 12px;
              border-radius: 8px;
            }
            .file-info-row {
              display: flex;
              margin-bottom: 5px;
              justify-content: space-between;
            }
            .file-info-label {
              font-size: 13px;
              color: var(--text-secondary);
            }
            .file-info-value {
              font-size: 13px;
              color: var(--text-primary);
              font-weight: 500;
            }
            .format-options {
              display: flex;
              gap: 5px;
              margin-top: 5px;
            }
            .format-option {
              flex: 1;
              padding: 15px 5px;
              border: 1px solid #ddd;
              border-radius: 4px;
              text-align: center;
              cursor: pointer;
              display: flex;
              flex-direction: column;
              align-items: center;
              background: var(--bg-secondary);
              color: var(--text-primary);
            }
            .format-option.selected {
              background: var(--bg-accent);
              color: black;
            }
            .format-option.selected .format-icon {
              color: black;
            }
            .format-option.selected .format-name {
              color: black;
            }
            .format-option:hover {
              background: var(--bg-hover);
            }
            .format-option.selected:hover {
              background: var(--bg-accent-hover);
            }
            .format-icon {
              font-size: 19px;
              margin-bottom: 5px;
              color: var(--text-primary);
            }
            .format-name {
              font-size: 10px;
              font-weight: 500;
              color: var(--text-primary);
            }
            .file-path {
              display: flex;
              align-items: center;
              border: 1px solid var(--border-primary);
              border-radius: 6px;
              margin-top: 5px;
              padding: 5px 10px;
              font-size: 12px;
              overflow: hidden;
              position: relative;
              background: var(--bg-primary);
            }
            .path-text {
              flex: 1;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              color: var(--text-primary);
              font-weight: 400;
            }
            .path-text:hover::after {
              content: attr(title);
              position: absolute;
              left: 0;
              top: 100%;
              background: var(--bg-tooltip);
              color: var(--text-tooltip);
              padding: 5px 10px;
              border-radius: 4px;
              z-index: 1000;
              width: max-content;
              max-width: 300px;
              font-size: 11px;
              white-space: normal;
              box-shadow: 0 2px 8px var(--shadow-primary);
            }
            .folder-icon {
              color: var(--text-tertiary);
            }
            .progress-container {
              margin-top: 15px;
            }
            .progress-bar {
              height: 6px;
              background: var(--bg-progress-track);
              border-radius: 5px;
              overflow: hidden;
            }
            .progress-fill {
              height: 100%;
              width: 0%;
              background: var(--accent-primary);
              transition: width 0.3s ease;
            }
            .progress-fill.finished {
              background: var(--success-primary);
            }
            .progress-percentage {
              font-size: 12px;
              color: var(--text-tertiary);
              text-align: start;
              margin-top: 2px;
            }
            .helper-text {
              font-size: 12px;
              color: var(--text-secondary);
              text-align: center;
              margin: 5px 0;
            }
            .action-buttons {
              display: flex;
              justify-content: space-between;
              margin-top: 10px;
              margin-bottom: 10px;
              gap: 10px;
            }
            .btn {
              flex: 1;
              padding: 6px 8px;
              border-radius: 4px;
              border: none;
              font-size: 13px;
              font-weight: 500;
              cursor: pointer;
              text-align: center;
              transition: background-color 0.2s ease;
            }
            .btn-cancel {
              background: var(--bg-primary);
              border: 1px solid var(--border-primary);
              color: var(--text-primary);
              font-weight: 700;
            }
            .btn-cancel:hover {
              background: var(--bg-hover);
            }
            .btn-convert {
              background: var(--accent-primary);
              color: var(--text-on-accent);
            }
            .btn-convert:hover {
              background: var(--accent-hover);
            }
            
            .notification-div {
              margin: 5px 0;
              padding: 10px;
              background-color: var(--error-primary);
              border-radius: 6px;
              color: var(--text-on-error);
              font-size: 12px;
              display: none;
            }
            .notification-div.visible {
              display: block;
            }

            .btn-convert:disabled {
              background: var(--bg-disabled);
              cursor: not-allowed;
              opacity: 0.7;
              color: var(--text-disabled);
            }
            
            .folder-btn {
              background: none;
              border: none;
              cursor: pointer;
              font-size: 12px;
              color: var(--text-secondary);
            }
            
            .folder-btn:disabled {
              opacity: 0.5;
              cursor: not-allowed;
            }
            .format-option.disabled {
              opacity: 0.5;
              cursor: not-allowed;
              background: var(--bg-disabled);
              border-color: var(--border-disabled);
              color: var(--text-disabled);
            }
            .format-option.disabled:hover {
              background: var(--bg-disabled);
            }

            /* Custom Scrollbar */
            ::-webkit-scrollbar {
              width: 7px;
              height: 12px;
            }
            
            ::-webkit-scrollbar-track {
              background: transparent;
              margin-bottom: 5px;
            }
            
            ::-webkit-scrollbar-thumb {
              background: var(--scrollbar-thumb);
              border-radius: 4px;
            }
            
            ::-webkit-scrollbar-thumb:hover {
              background: var(--scrollbar-thumb-hover);
            }
            
            ::-webkit-scrollbar-button {
              display: none;
            }

            /* Success Popup Styles */
            .success-popup {
              position: relative;
              background: var(--success-primary);
              color: var(--text-on-success);
              padding: 15px;
              border-radius: 8px;
              box-shadow: 0 4px 12px var(--shadow-success);
              z-index: 1000;
              display: none;
              animation: slideInFromTop 0.4s ease-out;
              margin-bottom: 5px;
              margin-top: 10px;
            }
            
            .success-popup.show {
              display: block;
            }
            
            @keyframes slideInFromTop {
              from {
                transform: translateY(-20px);
                opacity: 0;
              }
              to {
                transform: translateY(0);
                opacity: 1;
              }
            }
            
            .success-popup-header {
              display: flex;
              align-items: center;
              margin-bottom: 8px;
            }
            
            .success-popup-icon {
              margin-right: 10px;
              flex-shrink: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              color: var(--text-on-success);
            }
            
            .success-popup-title {
              flex: 1;
              font-size: 14px;
              font-weight: 600;
              line-height: 1.2;
              display: flex;
              align-items: center;
              color: var(--text-on-success);
            }
            
            .success-popup-close {
              background: none;
              border: none;
              color: var(--text-on-success);
              font-size: 18px;
              cursor: pointer;
              padding: 0;
              width: 20px;
              height: 20px;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 50%;
              opacity: 0.8;
            }
            
            .success-popup-close:hover {
              opacity: 1;
              background: var(--bg-success-hover);
            }
            
            .success-popup-message {
              font-size: 13px;
              margin-bottom: 8px;
              opacity: 0.9;
              color: var(--text-on-success);
            }
            
            .success-popup-path {
              position: absolute;
              bottom: 8px;
              right: 15px;
              background: none;
              border: none;
              padding: 4px 0;
              font-size: 12px;
              font-family: inherit;
              cursor: pointer;
              color: var(--text-on-success);
              text-decoration: underline;
              opacity: 0.9;
              transition: opacity 0.2s;
              margin-top: 25px;
            }
            
            .success-popup-path:hover {
              opacity: 1;
            }
          </style>
          
          <div class="cc-panel">
            <div class="panel-content">
              <div class="file-info">
                <div class="file-info-row" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; max-height: 2.8em; line-height: 1.4em; font-weight: bold; padding-top: 5px; padding-bottom: 10px; word-break: break-word; white-space: normal !important;">
                  <div style="width: 100%; max-width: 100%; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
                    ${download.name || 'Video'}
                  </div>
                </div>

                <div class="file-info-row">
                  <div class="file-info-label">Format</div>
                  <div class="file-info-value">${download.format || 'MP4 (H.264)'}</div>
                </div>
                <div class="file-info-row">
                  <div class="file-info-label">Duration</div>
                  <div class="file-info-value">${download.duration || '45:22'}</div>
                </div>
                <div class="file-info-row">
                  <div class="file-info-label">Size</div>
                  <div class="file-info-value">${download.size || '300 MB'}</div>
                </div>
              </div>
              
              <!-- Add notification div, initialize visibility based on caption check -->
              <div id="notificationDiv" class="notification-div ${!hasCaptionFile ? 'visible' : ''}">
                <span style="display: flex; align-items: center; font-weight: bold; margin-bottom: 5px;"> 
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-shrink: 0; margin-right: 5px;">
                    <path d="M9 9L11.9999 11.9999M11.9999 11.9999L14.9999 14.9999M11.9999 11.9999L9 14.9999M11.9999 11.9999L14.9999 9M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  No Captions Available
                </span>
                <span id="notificationMessage">We couldn't find any embedded or external captions in the selected video. To proceed, please choose a different file.</span>
              </div>
              
              <h3>Output Format</h3>
              ${formatOptionsHtml}
              
              <h3>Save File to</h3>
              <div class="file-path">
                <div class="path-text" id="savePath" title="${defaultPath}">${defaultPath}</div>
                <button class="folder-btn" id="folderBtn" ${!hasCaptionFile ? 'disabled' : ''}
                        onclick="window.parent.postMessage({panelId: '${panelId}', action: 'browse', format: document.querySelector('.format-option.selected').dataset.format}, '*')">
                  <div class="folder-icon" style="margin-top:2px; margin-left:8px;">
                    <svg width="16" height="16" viewBox="0 0 512 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M464 128H272l-64-64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V176c0-26.51-21.49-48-48-48zm0 272H48V112h140.12l64 64H464v224z"/>
                    </svg>
                  </div>       
                </button>
              </div>
            </div>

            <div class="panel-footer">
              <!-- Success Popup -->
              <div class="success-popup" id="successPopup">
                <div class="success-popup-header">
                  <div class="success-popup-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                  <div class="success-popup-title">Conversion Successful</div>
                  <button class="success-popup-close" onclick="hideSuccessPopup()">×</button>
                </div>
                <div class="success-popup-message" id="successMessage">
                  Your transcript has been successfully converted and saved as a well-formatted txt.
                </div>
                <div class="success-popup-path" id="successPath" onclick="openContainingFolder()" title="Click to open folder">
                  ${defaultPath}
                </div>
              </div>

              <div class="progress-container" id="progressContainer" style="${!hasCaptionFile || true ? 'display: none;' : ''}">
                <div class="progress-percentage" id="progressPercentage">0%</div>
                <div class="progress-bar">
                  <div class="progress-fill" id="progressFill"></div>
                </div>
              </div>

              <div class="action-buttons">
                <button class="btn btn-cancel" onclick="window.parent.postMessage({panelId: '${panelId}', action: 'cancel'}, '*')">
                  Cancel
                </button>
                <button class="btn btn-convert" id="convertBtn" ${!hasCaptionFile ? 'disabled' : ''}
                        onclick="window.parent.postMessage({
                          panelId: '${panelId}', 
                          action: 'convert',
                          format: document.querySelector('.format-option.selected')?.dataset.format || 'txt',
                          savePath: document.getElementById('savePath')?.innerText || '${defaultPath}'
                        }, '*')">
                  Convert to TXT
                </button>
              </div>
            </div>
          
          <script>

          window.addEventListener('message', function(event) {
  const data = event.data;
  if (data && data.action === 'update-save-path' && data.panelId === '${panelId}') {
    // Update just the save path element
    const pathElement = document.getElementById('savePath');
    if (pathElement) {
      pathElement.textContent = data.path;
      pathElement.title = data.path;
    }
  }
});
            // Global variable to track selected format
            let selectedFormat = 'txt';
            
            // Function to handle format selection
            function selectFormat(element, format) {
              // Update UI
              document.querySelectorAll('.format-option').forEach(el => {
                el.classList.remove('selected');
              });
              element.classList.add('selected');
              
              // Update selected format
              selectedFormat = format;
              
              // Hide success popup when format changes
              hideSuccessPopup();
              
              // Reset progress when format changes
              resetProgress();
              
              // Notify parent window
              window.parent.postMessage({
                panelId: '${panelId}', 
                action: 'format-select', 
                format: format
              }, '*');
              
              // Update visual feedback - change button text to show selected format
              document.getElementById('convertBtn').textPath = 'Convert to ' + format.toUpperCase();
              
              // Update file path display if needed
              const pathElement = document.getElementById('savePath');
              if (pathElement && pathElement.textPath) {
                let path = pathElement.textPath;
                // Replace extension if path has one
                if (path.includes('.')) {
                  path = path.replace(/\.[^.]+$/, '.' + format);
                } else {
                  path = path + '.' + format;
                }
                pathElement.textPath = path;
              }
            }
            
            // Function to show success popup
            function showSuccessPopup(savePath, format) {
              const popup = document.getElementById('successPopup');
              const messageElement = document.getElementById('successMessage');
              const pathElement = document.getElementById('successPath');
              
              if (popup && messageElement && pathElement) {
                messageElement.textContent = \`Your transcript has been successfully converted and saved as a well-formatted txt.\`;
                pathElement.textContent = \`Open File\`;
                pathElement.textPath = savePath;
                popup.classList.add('show');
              }
            }
            
            // Function to hide success popup
            function hideSuccessPopup() {
              const popup = document.getElementById('successPopup');
              if (popup) {
                popup.classList.remove('show');
              }
            }

                       function updateProgressUI(percent) {
              const progressContainer = document.getElementById('progressContainer');
              const progressFill = document.getElementById('progressFill');
              const progressText = document.getElementById('progressPercentage');

              // Show container only when progress is > 0
              if (percent > 0) {
                progressContainer.style.display = 'block';
              }
              
              if (progressFill && progressText) {
                progressFill.style.width = percent + '%';
                
                if (percent >= 100) {
                  progressText.textContent = 'Finished';
                  progressFill.style.backgroundColor = '#4CAF50';
                  
                  // Auto-reset progress after 2 seconds
                  setTimeout(() => {
                    resetProgress();
                  }, 2000);
                } else if (percent > 0) {
                  progressText.textContent = percent + '%';
                  progressFill.style.backgroundColor = '#f4791f';
                } else {
                  progressText.textContent = 'Ready';
                }
              }
            }
            
            window.addEventListener('message', function(event) {
              const data = event.data;
              if (data && data.action === 'update-progress') {
                updateProgressUI(data.percent);
              }
            });
            
            // Function to open the containing folder
            async function openContainingFolder() {
              const pathElement = document.getElementById('successPath');
              if (pathElement) {
                try {
                  const fullPath = pathElement.textPath;
                  
                  // Send message to parent to handle folder opening
                  window.parent.postMessage({
                    panelId: '${panelId}',
                    action: 'open-folder',
                    savePath: fullPath
                  }, '*');
                  
                  // Visual feedback
                  const originalBg = pathElement.style.backgroundColor;
                  pathElement.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                  setTimeout(() => {
                    pathElement.style.backgroundColor = originalBg;
                  }, 200);
                } catch (err) {
                  console.error('Failed to open folder:', err);
                }
              }
            }
            
            // Function to reset progress
            function resetProgress() {
              const progressContainer = document.getElementById('progressContainer');
              const progressFill = document.getElementById('progressFill');
              const progressText = document.getElementById('progressPercentage');
              
              if (progressContainer) {
                progressContainer.style.display = 'none';
              }
              if (progressFill) {
                progressFill.style.width = '0%';
                progressFill.style.backgroundColor = '#f4791f';
              }
              if (progressText) {
                progressText.textContent = '0%';
              }
            }

            // Listen for progress updates and success popup messages
            console.log('Setting up message listener in panel');
            window.addEventListener('message', function(event) {
              console.log('Panel received message:', event.data ? JSON.stringify(event.data) : 'empty');
              
              const data = event.data;
              if (data && data.panelId === '${panelId}') {
                if (data.action === 'update-progress') {
                  updateProgressUI(data.percent);
                } else if (data.action === 'show-success-popup') {
                  showSuccessPopup(data.savePath, data.format);
                } else if (data.action === 'hide-success-popup') {
                  hideSuccessPopup();
                  resetProgress();
                }
              }
            });
          </script>
        `,
        width: 360,
        closable: true
      });
      
      // After showing the panel, update the notification if needed
      if (!hasCaptionFile) {
        await this.updateNotification(
          panelId, 
          'No caption file found. Please make sure caption files exist in the same folder.',
          true
        );
      }
      
      // Clean up listener when closed
      if (!panelResult) {
        window.removeEventListener('message', messageHandler);
      }
      
    } catch (error) {
      console.error('Error showing CC panel:', error);
      this.api.ui.showNotification({
        title: 'Error',
        message: 'Failed to show CC panel',
        type: 'error',
        duration: 3000
      });
    }
  },
  
  /**
   * Extract filename from path
   */
  extractNameFromLocation(location) {
    if (!location) return 'download';
    const parts = location.split(/[\/\\]/);
    const filename = parts[parts.length - 1];
    return filename || 'download';
  },

  /**
   * Basic HTML sanitizer
   */
  sanitizeHtml(html) {
    if (!html) return '';
    return html.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  },

  /**
   * Update progress in panel
   */
  async updateConversionProgress(panelId, percent) {
    try {
      const safePercent = Math.max(0, Math.min(100, Math.round(percent)));
      
      console.log(`Sending progress update: ${safePercent}% to panel ${panelId}`);

      // Try to send to all possible targets
      const iframes = document.querySelectorAll('iframe');
      console.log(`Found ${iframes.length} iframes to try sending progress to`);
      
      let messageSent = false;
      iframes.forEach(iframe => {
        try {
          iframe.contentWindow.postMessage({
            panelId: panelId,
            action: 'update-progress',
            percent: safePercent
          }, '*');
          console.log(`Posted message to iframe: ${iframe.id || 'unnamed'}`);
          messageSent = true;
        } catch (err) {
          console.log(`Failed to post to iframe: ${err.message}`);
        }
      });
      
      // Try parent window
      try {
        window.parent.postMessage({
          panelId: panelId,
          action: 'update-progress',
          percent: safePercent
        }, '*');
        console.log('Posted message to parent window');
        messageSent = true;
      } catch (err) {
        console.log(`Failed to post to parent: ${err.message}`);
      }
      
      // Try current window
      try {
        window.postMessage({
          panelId: panelId,
          action: 'update-progress',
          percent: safePercent
        }, '*');
        console.log('Posted message to current window');
        messageSent = true;
      } catch (err) {
        console.log(`Failed to post to current window: ${err.message}`);
      }
      
      if (!messageSent) {
        console.log('WARNING: Could not send progress update message to any target');
      }

    } catch (error) {
      console.error('Error updating progress:', error);
    }
  },

  /**
   * Get captions for video
   */
  async getCaptionsForVideo(videoUrl, captionLocation) {
    try { 
        const locationToUse = captionLocation || this.captionLocation || '';
        console.log('Getting captions for video:', videoUrl);
        console.log('Using caption location:', locationToUse);

        console.log('Stored location type:', typeof locationToUse);
        console.log('Stored location value:', JSON.stringify(locationToUse));
        
        if (!locationToUse) {
            console.log('No caption location available, returning empty content');
            return '';
        }
        
        // Extract filePath if it's an object
        let filePath = locationToUse;
        if (typeof locationToUse === 'object' && locationToUse !== null) {
            filePath = locationToUse.filePath || locationToUse.path || '';
            // Handle nested objects
            if (typeof filePath === 'object' && filePath !== null) {
                filePath = filePath.filePath || filePath.path || '';
            }
        }
        
        if (!filePath) {
            console.log('Could not extract a valid file path from caption location, returning empty content');
            return '';
        }
        
        // Normalize the path to fix double backslashes caused by JSON.stringify/parse
        if (typeof filePath === 'string') {
            // Replace any escaped backslashes (\\) with single backslashes (\)
            filePath = filePath.replace(/\\\\/g, '\\');
            console.log('Normalized file path:', filePath);
        }
        
        console.log('Reading caption file from:', filePath);
        const result = await this.api.utilities.readFileContents(filePath);
        console.log('Caption content received:', result);
        
        if (result && result.success && result.data) {
            return result.data;
        } else {
            console.log('Failed to read file contents:', result.error || 'Unknown error');
            return '';
        }
    } catch (error) {
        console.error('Error reading file contents:', error);
        return '';
    }
  },

  /**
   * Convert SRT to text
   */
  convertSrtToText(srtContent) {
    console.log('Starting SRT conversion...');
    console.log('Input SRT content length:', srtContent ? srtContent.length : 0);
    console.log('First 100 chars:', srtContent ? srtContent.substring(0, 100) : 'empty');
    
    const blocks = srtContent.split("\n\n");
    console.log(`Split into ${blocks.length} blocks`);
    
    let initialChunks = [];
    let currentChunkText = "";
    let chunkStartTime = 0;
    let lastEndTimeSeconds = 0;

    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      if (!block.trim()) {
        console.log(`Block ${i}: Empty, skipping`);
        continue;
      }

      const lines = block.split("\n");
      console.log(`Block ${i}: ${lines.length} lines`);
      
      if (lines.length < 3) {
        console.log(`Block ${i}: Not enough lines, skipping`);
        continue;
      }

      const timestampLine = lines[1];
      console.log(`Block ${i}: Timestamp: "${timestampLine}"`);
      
      const [startTimeStr, endTimeStr] = timestampLine.split(" --> ");
      console.log(`Block ${i}: Start: "${startTimeStr}", End: "${endTimeStr}"`);
      
      const currentEndTimeSeconds = this.convertTimeToSeconds(endTimeStr);
      console.log(`Block ${i}: End time in seconds: ${currentEndTimeSeconds}`);
      
      const content = lines.slice(2).join(" ").trim();
      console.log(`Block ${i}: Content: "${content.substring(0, 50)}${content.length > 50 ? '...' : ''}"`);

      // Check if adding this block exceeds 30 seconds
      if (
        currentChunkText === "" ||
        currentEndTimeSeconds - chunkStartTime < 30
      ) {
        // Add to current chunk
        if (currentChunkText === "") {
          chunkStartTime = this.convertTimeToSeconds(startTimeStr);
          console.log(`Block ${i}: Starting new chunk at ${chunkStartTime}s`);
        }
        currentChunkText += (currentChunkText ? " " : "") + content;
        console.log(`Block ${i}: Added to chunk, length now: ${currentChunkText.length}`);
        lastEndTimeSeconds = currentEndTimeSeconds;
      } else {
        // Chunk complete, store it
        console.log(`Block ${i}: Chunk complete (${currentEndTimeSeconds - chunkStartTime}s)`);
        initialChunks.push(currentChunkText);
        console.log(`Block ${i}: Now have ${initialChunks.length} chunks`);

        // Start new chunk
        currentChunkText = content;
        chunkStartTime = this.convertTimeToSeconds(startTimeStr);
        lastEndTimeSeconds = currentEndTimeSeconds;
        console.log(`Block ${i}: Started new chunk: "${content.substring(0, 50)}${content.length > 50 ? '...' : ''}"`);
      }
    }

    // Add final chunk
    if (currentChunkText) {
      console.log(`Adding final chunk of length ${currentChunkText.length}`);
      initialChunks.push(currentChunkText);
    }

    console.log(`Before adjustment: ${initialChunks.length} chunks`);
    
    // Adjust sentences between chunks
    const adjustedChunks = this.adjustSentencesBetweenChunks(initialChunks);
    console.log(`After adjustment: ${adjustedChunks.length} chunks`);

    const result = adjustedChunks.join("\n\n");
    console.log(`Final text length: ${result.length}`);
    console.log(`First 100 chars: "${result.substring(0, 100)}..."`);
    
    // Progress updates for large files
    if (blocks.length > 20) {
      let lastReportedProgress = 30;
      const progressInterval = Math.floor(blocks.length / 10);
      
      for (let i = 0; i < blocks.length; i++) {
        if (i > 0 && i % progressInterval === 0) {
          const currentProgress = Math.min(69, 30 + Math.floor((i / blocks.length) * 40));
          if (currentProgress > lastReportedProgress) {
            lastReportedProgress = currentProgress;
            console.log(`Conversion progress: ${currentProgress}%`);
          }
        }
      }
    }
    
    return result;
  },

  /**
   * Adjust sentences between chunks
   */
  adjustSentencesBetweenChunks(chunks) {
    console.log('Starting sentence adjustment...');
    
    if (chunks.length < 2) {
      console.log('Only one chunk, no adjustment needed');
      return chunks;
    }

    for (let i = 0; i < chunks.length - 1; i++) {
      let currentChunk = chunks[i].trim();
      let nextChunk = chunks[i + 1].trim();
      
      console.log(`Checking chunks ${i} and ${i+1}:`);
      console.log(`  Chunk ${i} ends: "${currentChunk.substring(Math.max(0, currentChunk.length - 50))}"`);
      console.log(`  Chunk ${i+1} starts: "${nextChunk.substring(0, Math.min(50, nextChunk.length))}"`);

      // Check if current chunk ends mid-sentence
      if (!/[.?!]$/.test(currentChunk)) {
        console.log(`  Chunk ${i} doesn't end with punctuation`);
        
        // Find first sentence in next chunk
        const sentenceMatch = nextChunk.match(/^.*?([.?!])(?=\s|$)/);

        if (sentenceMatch) {
          const firstSentence = sentenceMatch[0];
          console.log(`  Moving sentence: "${firstSentence}"`);
          
          // Move sentence to current chunk
          chunks[i] = (currentChunk + " " + firstSentence).trim();
          console.log(`  Chunk ${i} now: "${chunks[i].substring(0, 50)}...${chunks[i].substring(Math.max(0, chunks[i].length - 50))}"`);
          
          // Remove from next chunk
          chunks[i + 1] = nextChunk.substring(firstSentence.length).trim();
          console.log(`  Chunk ${i+1} now: "${chunks[i+1].substring(0, Math.min(50, chunks[i+1].length))}..."`);
        } else {
          console.log(`  No complete sentence found to move`);
        }
      } else {
        console.log(`  Chunk ${i} ends properly, no adjustment needed`);
      }
    }
    
    // Filter empty chunks
    const filteredChunks = chunks.filter((chunk) => chunk.length > 0);
    console.log(`Adjustment complete: ${chunks.length} -> ${filteredChunks.length} chunks`);
    
    return filteredChunks;
  },

  /**
   * Convert time string to seconds
   */
  convertTimeToSeconds(timeStr) {
    console.log(`Converting time: "${timeStr}"`);
    
    if (!timeStr) {
      console.log('Empty time string');
      return 0;
    }
    
    const [hms, ms] = timeStr.split(",");
    if (!hms) {
      console.log('No HMS part');
      return 0;
    }
    
    const parts = hms.split(":");
    if (parts.length !== 3) {
      console.log(`Invalid format: ${parts.length} parts instead of 3`);
      return 0;
    }
    
    const [hours, minutes, seconds] = parts.map(Number);
    const milliseconds = ms ? parseInt(ms, 10) : 0;
    
    const totalSeconds = hours * 3600 + minutes * 60 + seconds + milliseconds / 1000;
    console.log(`Converted to ${totalSeconds} seconds`);
    
    return totalSeconds;
  },

  /**
   * Export file with specified format
   * @param {string} content - Text content
   * @param {string} filename - Original filename path
   * @param {string} format - File format ('txt' or 'docx')
   * @returns {Promise<boolean>} - Success status
   */
  async exportFile(content, filename, format = 'txt') {
    try {
      console.log(`Attempting to export file with path: ${filename} in format: ${format}`);
      
      // Validate content
      if (!content || content.length === 0) {
        console.error('Error: Empty content, cannot save file');
        this.api.ui.showNotification({
          title: 'Save Error',
          message: 'Cannot save empty content',
          type: 'error',
          duration: 3000
        });
        return false;
      }
      
      // Handle DOCX format
      if (format === 'docx') {
        if (!this.docxAvailable) {
          throw new Error('DOCX package not available. Please install: npm install docx');
        }
        
        try {
          console.log('Creating DOCX document...');
          const docxBuffer = await this.convertToDocx(content, 'Video Captions');
          
          console.log('DOCX buffer size:', docxBuffer.byteLength, 'bytes');
          
          // Convert ArrayBuffer to Uint8Array for file writing
          const uint8Array = new Uint8Array(docxBuffer);
          
          // Save DOCX file
          const result = await this.api.utilities.writeFile({
            fileName: filename,
            content: uint8Array,
            customPath: filename,
            overwrite: true,
            encoding: 'binary' // Important for binary files like DOCX
          });
          
          if (result && result.success) {
            console.log(`DOCX file saved successfully to: ${result.filePath || filename}`);
            return true;
          } else {
            throw new Error(result?.error || 'Failed to write DOCX file');
          }
        } catch (docxError) {
          console.error('DOCX creation failed:', docxError);
          throw new Error('Failed to create DOCX: ' + docxError.message);
        }
      }
      
      // Handle TXT format (default)
      else {
        // Ensure content is properly formatted for text file
        const textContent = typeof content === 'string' ? content : String(content);
        
        // Save as text file
        const result = await this.api.utilities.writeFile({
          fileName: filename,
          content: textContent,
          customPath: filename,
          overwrite: true,
          encoding: 'utf8'
        });
        
        if (result && result.success) {
          console.log(`Text file saved successfully to: ${result.filePath || filename}`);
          return true;
        } else {
          throw new Error(result?.error || 'Failed to write text file');
        }
      }
      
    } catch (error) {
      console.error('Error in exportFile:', error);
      this.api.ui.showNotification({
        title: 'Export Error',
        message: error.message || 'Failed to save file',
        type: 'error',
        duration: 3000
      });
      return false;
    }
  },

  /**
   * Handle the convert action from the panel
   * @param {Object} download - The download item
   * @param {string} format - The selected format
   * @param {string} savePath - The path to save the file
   * @param {string} panelId - ID of the panel triggering the action
   */
  async handleConvertAction(download, format, savePath, panelId) {
    try {
      console.log(`Starting conversion with panelId: ${panelId}`);
      
      // Get the captions first before showing progress
      const captionContent = await this.getCaptionsForVideo(download.videoUrl, download.captionLocation);
      
      // Check if we got any caption content before doing anything else
      if (!captionContent || captionContent.trim() === '') {
        console.log('No caption content found');
        // Show notification in the panel
        await this.updateNotification(
          panelId, 
          'No caption file found. Please make sure caption files exist in the same folder.',
          true
        );
        
        // Show notification to user
        this.api.ui.showNotification({
          title: 'No Captions Available',
          message: 'No caption file found. Please make sure caption files exist in the same folder.',
          type: 'error',
          duration: 3000
        });
        return; // Exit without showing progress
      }
      
      // Only show progress if we have caption content
      await this.updateConversionProgress(panelId, 10);
      console.log('Caption content found, proceeding with conversion');
      
      // Hide notification if content exists
      await this.updateNotification(panelId, '', false);
      
      // Rest of conversion process
      console.log("Captions retrieved, updating to 30%");
      await this.updateConversionProgress(panelId, 30);
      
      // Convert to text
      const text = this.processSubtitleContent(captionContent);
      console.log("Text converted, updating to 70%");
      await this.updateConversionProgress(panelId, 70);
      
      // Export the file with the selected format
      const exportResult = await this.exportFile(text, savePath, format);
      
      if (exportResult) {
        // Update progress to complete
        await this.updateConversionProgress(panelId, 100);
      }
      
    } catch (error) {
      console.error('Error in conversion:', error);
      
      // Show notification in the panel
      await this.updateNotification(
        panelId, 
        `Error: ${error.message || 'Failed to convert captions'}`,
        true
      );
      
      this.api.ui.showNotification({
        title: 'Conversion Error',
        message: error.message || 'Failed to convert captions',
        type: 'error',
        duration: 3000
      });
    }
  },

  /**
   * Show save file dialog
   * @param {Object} download - Download object with file info
   * @param {string} format - Target format ('txt' or 'docx')
   * @returns {Promise<Object|null>} - File path result or null
   */
  async showSaveFileDialog(download, format) {
    try {
      // Dynamic filters based on format and DOCX availability
      let filters = [{ name: 'Text Files', extensions: ['txt'] }];
      let defaultExtension = 'txt';
      
      if (format === 'docx' && this.docxAvailable) {
        filters = [
          { name: 'Word Documents', extensions: ['docx'] },
          { name: 'Text Files', extensions: ['txt'] }
        ];
        defaultExtension = 'docx';
      }
      
      // Clean the base name properly
      let baseName = 'captions';
      if (download.name) {
        // Remove any file extension from the original name
        baseName = download.name.replace(/\.[^/.]+$/, "");
        // Also remove common video file extensions that might be embedded
        baseName = baseName.replace(/\.(mp4|mkv|avi|mov|wmv|flv|webm|m4v)$/i, "");
      }
      
      // Create proper default path
      const defaultFilename = `${baseName}.${defaultExtension}`;
      let defaultPath = defaultFilename;
      
      // If download has a location, use it as the directory
      if (download.location) {
        defaultPath = `${download.location}/${defaultFilename}`;
      }
      
      console.log('Base name:', baseName);
      console.log('Default filename:', defaultFilename);
      console.log('Default path:', defaultPath);
      console.log('Showing save dialog with filters:', filters);
      
      const result = await this.api.ui.showSaveFileDialog({
        title: `Save Captions as ${format.toUpperCase()}`,
        defaultPath: defaultPath,
        filters: filters
      });
      
      if (result && result.filePath) {
        console.log('User selected file path:', result.filePath);
        
        // Ensure the file has the correct extension based on the requested format
        let filePath = result.filePath;
        
        // Force the correct extension based on format
        if (format === 'docx') {

          // Remove any existing extension and add .docx
          filePath = filePath.replace(/\.[^/.]+$/, '') + '.docx';
        } else if (format === 'txt') {
          // Remove any existing extension and add .txt
          filePath = filePath.replace(/\.[^/.]+$/, '') + '.txt';
        }
        
        console.log('Final file path:', filePath);
        
        return { 
          filePath: filePath, 
          format: format // Return the original requested format
        };
      }
      return null;
    } catch (error) {
      console.error('Error showing file dialog:', error);
      return null;
    }
  },

  /**
   * Convert VTT caption content to readable text
   * @param {string} vttContent - The VTT content to convert
   * @returns {string} - Formatted text content
   */
  convertVttToText(vttContent) {
    console.log('Converting VTT to text with consolidated approach');
    if (!vttContent || vttContent.trim() === '') {
      console.error('Empty VTT content provided');
      this.api.ui.showNotification({
        title: 'Error',
        message: 'Invalid VTT file',
        type: 'error',
        duration: 30});
      return '';
    }
    try {
      const lines = vttContent.split(/\r?\n/);
      const extractedText = [];
      let isHeader = true;
      let lastCleanedText = '';
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Skip empty lines
        if (!line) continue;
        
        // Skip header content (WEBVTT and metadata) - improved logic
        if (isHeader) {
          // Skip lines that contain WEBVTT or start with metadata markers
          if (line.includes('WEBVTT') || line.startsWith('NOTE') || line.startsWith('STYLE') || line.startsWith('Kind:') || line.startsWith('Language:')) {
            continue;
          }
          // If we encounter a timestamp line, we're past the header
          if (line.includes('-->')) {
            isHeader = false;
            continue;
          }
          // If it's not a header line and not a timestamp, check if it looks like content
          if (!line.includes('-->') && line.length > 0) {
            // If it contains time patterns or looks like content, we're past header
            if (line.match(/^\d+:\d+/) || line.includes('-') || line.includes('(')) {
              isHeader = false;
              // Don't continue here, process this line as content
            } else {
              // Assume remaining header metadata, skip
              continue;
            }
          }
        }
        
        // Skip timestamp lines and cue settings
        if (line.includes('-->')) {
          continue;
        }
        
        // Skip style and note blocks that appear later in file
        if (line.startsWith('STYLE') || line.startsWith('NOTE')) {
          continue;
        }
        
        // Process content lines (we're past header now)
        if (!isHeader) {
          const cleaned = this.cleanTextLine(line);
          // Only add non-empty, unique text that differs from the last added text
          if (cleaned && cleaned !== lastCleanedText) {
            extractedText.push(cleaned);
            lastCleanedText = cleaned;
          }
        }
      }
      
      // Join with new lines for better readability
      const result = extractedText.join('\n').trim();
      console.log(`VTT conversion completed. Extracted ${extractedText.length} lines of text.`);
      console.log('Sample output:', result.substring(0, 200) + (result.length > 200 ? '...' : ''));
      
      return result;
    } catch (error) {
      console.error('Error converting VTT to text:', error);
      return '';
    }
  },

  /**
   * Clean a single line of VTT text
   * @param {string} line - The line to clean
   * @returns {string} - Cleaned text
   */
  cleanTextLine(line) {
    if (!line) return '';
    
    // Skip standalone annotations like [Music] or [Applause]
    if (/^\[[\w\s]+\]$/.test(line.trim())) {
      return '';
    }
    
    let cleaned = line;
    
    // Remove all HTML-like tags including VTT-specific formatting
    cleaned = cleaned.replace(/<[^>]*>/g, '');
    
    // Remove timestamps inside text like <00:00:16.520>
    cleaned = cleaned.replace(/<\d+:\d+:\d+\.\d+>/g, '');
    
    // Remove position and alignment info
    cleaned = cleaned.replace(/align:[^ ]* position:[^ ]*/g, '');
    cleaned = cleaned.replace(/align:\w+/g, '');
    cleaned = cleaned.replace(/position:\d+%/g, '');
    
    // Remove any remaining HTML tags
    cleaned = cleaned.replace(/<[^>]*>/g, '');
    
    // Remove annotations like [Music] anywhere in the text but preserve speaker indicators
    cleaned = cleaned.replace(/\[[^\]]*\]/g, '');
    
    // Handle speaker indicators - preserve them for context
    // Examples: "SHAREEDUH MCGEE:", "- (CHANTING)", etc.
    // Keep these as they provide context for who is speaking
    
    // Clean up weird spacing issues
    cleaned = cleaned.replace(/\s+/g, ' ').trim();
    
    // Skip lines that are just timestamps or metadata
    if (cleaned.match(/^\d+:\d+:\d+\.\d+$/)) {
      return '';
    }
    
    // Skip lines that are just dashes or punctuation
    if (cleaned.match(/^[-\s]*$/)) {
      return '';
    }
    
    return cleaned;
  },

  // Detect if a file is VTT based on content
  isVttContent(content) {
    if (!content) return false;
    const trimmed = content.trim();
    // Check for WEBVTT at the beginning, possibly followed by metadata
    return trimmed.startsWith('WEBVTT') || 
           trimmed.includes('WEBVTT') && trimmed.indexOf('WEBVTT') < 50; // Allow some flexibility for BOMs or whitespace
  },

  /**
   * Process file content
   * @param {string} content - Caption file content
   * @returns {string} - Formatted text
   */
  processSubtitleContent(content) {
    console.log('Processing subtitle content...');
    console.log('Content length:', content ? content.length : 0);
    console.log('Content preview (first 200 chars):', content ? content.substring(0, 200) : 'empty');
    
    if (!content || content.trim() === '') {
      console.error('Empty or null content provided to processSubtitleContent');
      return '';
    }
    
    if (this.isVttContent(content)) {
      console.log('Processing as VTT file');
      const result = this.convertVttToText(content);
      console.log('VTT processing result length:', result ? result.length : 0);
      return result;
    } else {
      console.log('Processing as SRT file');
      const result = this.convertSrtToText(content);
      console.log('SRT processing result length:', result ? result.length : 0);
      return result;
    }
  },

  /**
   * Convert VTT format to SRT-like format
   * @param {string} vttContent - VTT content
   * @returns {string} - SRT-like content
   */
  convertVttToSrtFormat(vttContent) {
    try {
      console.log('Starting VTT to SRT conversion...');
      
      // Skip the WEBVTT header and metadata
      let lines = vttContent.split('\n');
      let processedLines = [];
      let captionCount = 1;
      let isHeader = true;
      let captionText = [];
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Skip header lines
        if (isHeader) {
          if (line === '' || line.includes('WEBVTT') || line.includes('Kind:') || line.includes('Language:')) {
            continue;
          }
          isHeader = false;
        }
        
        // Process timestamp lines
        if (line.includes('-->')) {
          // If we had caption text from previous entries, add a blank line before new caption
          if (captionText.length > 0) {
            processedLines.push('');
            captionText = [];
          }
          
          // Add counter for SRT format
          processedLines.push(captionCount.toString());
          captionCount++;
          
          // Clean and add the timestamp (convert VTT format to SRT format)
          // Extract just the timestamp part, removing any styling info
          const timestampPart = line.split(' align:')[0].trim();
          const formattedTimestamp = timestampPart.replace(/\./g, ',');
          processedLines.push(formattedTimestamp);
        } 
        // Add content lines (skip empty lines and metadata)
        else if (line !== '' && !isHeader && !line.startsWith('NOTE') && !line.startsWith('STYLE')) {
          captionText.push(line);
          processedLines.push(line);
        } 
        // Add blank line between captions
        else if (line === '' && captionText.length > 0) {
          captionText = [];
        }
      }
      
      const result = processedLines.join('\n');
      console.log('VTT to SRT conversion output sample:', result.substring(0, 200) + '...');
      return result;
    } catch (error) {
      console.error('Error converting VTT to SRT format:', error);
      return vttContent; // Return original content on error
    }
  },

  /**
   * Convert VTT caption content to plain text.
   * Removes headers, timestamps, and tags, returning only the spoken text.
   * @param {string} vttContent - The raw VTT file content.
   * @returns {string} - The extracted plain text.
   */
  vttToPlainText(vttContent) {
    // Remove WEBVTT header and any metadata lines
    let lines = vttContent.split(/\r?\n/);
    let output = [];
    let skipBlock = false;

    for (let line of lines) {
      line = line.trim();

      // Skip empty lines and metadata/header lines
      if (
        line === '' ||
        line.startsWith('WEBVTT') ||
        line.startsWith('Kind:') ||
        line.startsWith('Language:') ||
        /^[0-9]+$/.test(line) // skip cue numbers (rare in VTT, but possible)
      ) {
        continue;
      }

      // Remove timestamps and tags like <...>
      line = line.replace(/<[^>]+>/g, '');
      // Remove bracketed cues like [Music], [Applause]
      line = line.replace(/\[[^\]]+\]/g, '');
      // Remove any remaining HTML tags
      line = line.replace(/<\/?[^>]+(>|$)/g, '');

      // If the line is still not empty after cleaning, add it
      if (line.trim() !== '') {
        output.push(line.trim());
      }
    }

    return output.join(' ');
  },

  /**
   * Update notification message in the panel
   * @param {string} panelId - Panel ID
   * @param {string} message - Notification message
   * @param {boolean} show - Whether to show or hide the notification
   */
  async updateNotification(panelId, message, show = true) {
    try {
      console.log(`${show ? 'Showing' : 'Hiding'} notification in panel ${panelId}: ${message}`);
      
      // Try to target all potential receivers of the message
      // 1. Try to find the iframe directly
      const iframes = document.querySelectorAll('iframe');
      
      let messageSent = false;
      iframes.forEach(iframe => {
        try {
          iframe.contentWindow.postMessage({
            panelId: panelId,
            action: 'update-notification',
            message: message,
            show: show
          }, '*');
          messageSent = true;
        } catch (err) {
          console.log(`Failed to post notification to iframe: ${err.message}`);
        }
      });
      
      // 2. Also try sending to parent and current window as fallbacks
      try {
        window.parent.postMessage({
          panelId: panelId,
          action: 'update-notification',
          message: message,
          show: show
        }, '*');
        messageSent = true;
      } catch (err) {
        console.log(`Failed to post notification to parent: ${err.message}`);
      }
      
      try {
        window.postMessage({
          panelId: panelId,
          action: 'update-notification',
          message: message,
          show: show
        }, '*');
        messageSent = true;
      } catch (err) {
        console.log(`Failed to post notification to current window: ${err.message}`);
      }
      
      if (!messageSent) {
        console.log('WARNING: Could not send notification update message to any target');
      }
    } catch (error) {
      console.error('Error updating notification:', error);
    }
  },

  /**
   * Check if DOCX package is available and working
   * @returns {Promise<boolean>} - Whether DOCX is available
   */
  async checkDocxAvailability() {
    try {      
      const docx = await require('docx');
      
      const { Document, Paragraph, TextRun } = docx;
      
       // Check if they are actually constructors
      if (typeof Document !== 'function') {
              throw new Error('Document is not a constructor');
            }
      if (typeof Paragraph !== 'function') {
              throw new Error('Paragraph is not a constructor');
            }
      if (typeof TextRun !== 'function') {
              throw new Error('TextRun is not a constructor');
            }

      const testDoc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun("Test document creation")
              ],
            }),
          ],
        }],
      });
      
      return true;
      
    } catch (error) {
      console.log('DOCX package not available:', error.message);
      console.log('Full error:', error);
      return false;
    }
  },

  /**
   * Convert text content to DOCX format
   * @param {string} content - Text content to convert
   * @param {string} title - Document title
   * @returns {Promise<ArrayBuffer>} - DOCX file buffer
   */
  async convertToDocx(content, title = 'Video Captions') {
    try {
      // Use the sandbox's require function (await it since it's async)
      const docx = await require('docx');
      const { Document, Paragraph, TextRun, Packer } = docx;
      
      // Validate constructors
      if (typeof Document !== 'function' || typeof Paragraph !== 'function' || typeof TextRun !== 'function') {
        throw new Error('DOCX constructors not available');
      }
      
      // Split content into paragraphs (handle both \n\n and \n splitting)
      let paragraphs = content.split('\n\n').filter(p => p.trim());
      
      // If we don't get enough paragraphs with \n\n, try splitting on single \n
      if (paragraphs.length < 3) {
        paragraphs = content.split('\n').filter(p => p.trim());
      }
      
      console.log(`Creating DOCX with ${paragraphs.length} paragraphs`);
      
      // Create document children
      const children = [
        // Title
        new Paragraph({
          children: [
            new TextRun({
              text: title,
              bold: true,
              size: 32, // 16pt (size in half-points)
            }),
          ],
          spacing: {
            after: 400, // Space after title
          },
        }),
      ];
      
      // Add content paragraphs
      paragraphs.forEach((paragraph, index) => {
        if (paragraph.trim()) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: paragraph.trim(),
                  size: 24, // 12pt (size in half-points)
                }),
              ],
              spacing: {
                after: 200, // Space after paragraph
              },
            })
          );
        }
      });
      
      // Create the document
      const doc = new Document({
        sections: [{
          properties: {},
          children: children,
        }],
      });
      
      console.log('Generating DOCX blob...');
      
      // Use toBlob() instead of toBuffer() for browser compatibility
      const blob = await Packer.toBlob(doc);
      
      console.log('DOCX blob generated, size:', blob.size, 'bytes');
      
      // Convert blob to ArrayBuffer for file writing
      const arrayBuffer = await blob.arrayBuffer();
      
      console.log('DOCX ArrayBuffer size:', arrayBuffer.byteLength, 'bytes');
      
      return arrayBuffer;
      
    } catch (error) {
      console.error('Error creating DOCX:', error);
      throw new Error('Failed to create DOCX document: ' + error.message);
    }
  },

  /**
   * Export file with specified format
   * @param {string} content - Text content
   * @param {string} filename - Original filename path
   * @param {string} format - File format ('txt' or 'docx')
   * @returns {Promise<boolean>} - Success status
   */
  async exportFile(content, filename, format = 'txt') {
    try {
      console.log(`Attempting to export file with path: ${filename} in format: ${format}`);
      
      // Validate content
      if (!content || content.length === 0) {
        console.error('Error: Empty content, cannot save file');
        this.api.ui.showNotification({
          title: 'Save Error',
          message: 'Cannot save empty content',
          type: 'error',
          duration: 3000
        });
        return false;
      }
      
      // Handle DOCX format
      if (format === 'docx') {
        if (!this.docxAvailable) {
          throw new Error('DOCX package not available. Please install: npm install docx');
        }
        
        try {
          console.log('Creating DOCX document...');
          const docxBuffer = await this.convertToDocx(content, 'Video Captions');
          
          console.log('DOCX buffer size:', docxBuffer.byteLength, 'bytes');
          
          // Convert ArrayBuffer to Uint8Array for file writing
          const uint8Array = new Uint8Array(docxBuffer);
          
          // Save DOCX file
          const result = await this.api.utilities.writeFile({
            fileName: filename,
            content: uint8Array,
            customPath: filename,
            overwrite: true,
            encoding: 'binary' // Important for binary files like DOCX
          });
          
          if (result && result.success) {
            console.log(`DOCX file saved successfully to: ${result.filePath || filename}`);
            return true;
          } else {
            throw new Error(result?.error || 'Failed to write DOCX file');
          }
        } catch (docxError) {
          console.error('DOCX creation failed:', docxError);
          throw new Error('Failed to create DOCX: ' + docxError.message);
        }
      }
      
      // Handle TXT format (default)
      else {
        // Ensure content is properly formatted for text file
        const textContent = typeof content === 'string' ? content : String(content);
        
        // Save as text file
        const result = await this.api.utilities.writeFile({
          fileName: filename,
          content: textContent,
          customPath: filename,
          overwrite: true,
          encoding: 'utf8'
        });
        
        if (result && result.success) {
          console.log(`Text file saved successfully to: ${result.filePath || filename}`);
          return true;
        } else {
          throw new Error(result?.error || 'Failed to write text file');
        }
      }
      
    } catch (error) {
      console.error('Error in exportFile:', error);
      this.api.ui.showNotification({
        title: 'Export Error',
        message: error.message || 'Failed to save file',
        type: 'error',
        duration: 3000
      });
      return false;
    }
  },
};

module.exports = ccToMarkdownPlugin;