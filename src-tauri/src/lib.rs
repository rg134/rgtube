use std::io::Result as IoResult;
use std::process::{Command, Output};

#[tauri::command]
fn download_video(video_url: String, download_dir: String) -> Result<String, String> {
    let output: IoResult<Output> = Command::new("yt-dlp")
        .arg("-P")
        .arg(&download_dir)
        .arg(&video_url)
        .output();

    match output {
        Ok(out) if out.status.success() => Ok("download completed".into()),
        Ok(out) => Err(String::from_utf8_lossy(&out.stderr).into_owned()),
        Err(e) => Err(e.to_string()),
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() -> () {
    tauri::Builder::default()
        .plugin(tauri_plugin_log::Builder::default().build())
        .plugin(tauri_plugin_store::Builder::new().build())
        .invoke_handler(tauri::generate_handler![download_video])
        .run(tauri::generate_context!())
        .expect("error running tauri")
}
