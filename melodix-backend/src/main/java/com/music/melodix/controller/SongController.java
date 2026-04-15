package com.music.melodix.controller;

import com.music.melodix.dto.ReviewRequest;
import com.music.melodix.dto.SongResponse;
import com.music.melodix.model.Song;
import com.music.melodix.service.SongService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/songs")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class SongController {

    private final SongService songService;

    @Value("${melodix.upload.dir}")
    private String uploadDir;

    // Subir cancion — solo ARTIST y ADMIN
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<SongResponse> uploadSong(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam("artist") String artist,
            @RequestParam(value = "album", required = false) String album,
            @RequestParam(value = "genre", required = false) String genre,
            @RequestParam(value = "duration", required = false) Integer duration,
            @AuthenticationPrincipal UserDetails userDetails) throws IOException {
        return ResponseEntity.ok(songService.uploadSong(
                file, title, artist, album, genre, duration, userDetails.getUsername()));
    }

    // Ver canciones aprobadas — todos
    @GetMapping
    public List<SongResponse> getAllSongs() {
        return songService.getAllApprovedSongs();
    }

    // Ver mis canciones — artista
    @GetMapping("/my-songs")
    public List<SongResponse> getMySongs(@AuthenticationPrincipal UserDetails userDetails) {
        return songService.getMySongs(userDetails.getUsername());
    }

    // Ver canciones pendientes — admin
    @GetMapping("/pending")
    public List<SongResponse> getPendingSongs() {
        return songService.getPendingSongs();
    }

    // Aprobar cancion — admin
    @PostMapping("/{id}/approve")
    public ResponseEntity<SongResponse> approveSong(@PathVariable Long id) {
        return ResponseEntity.ok(songService.approveSong(id));
    }

    // Rechazar cancion — admin
    @PostMapping("/{id}/reject")
    public ResponseEntity<SongResponse> rejectSong(
            @PathVariable Long id,
            @RequestBody ReviewRequest request) {
        return ResponseEntity.ok(songService.rejectSong(id, request));
    }

    @GetMapping("/search")
    public List<SongResponse> search(@RequestParam(required = false) String title,
                                     @RequestParam(required = false) String artist) {
        if (title != null) return songService.searchByTitle(title);
        if (artist != null) return songService.searchByArtist(artist);
        return songService.getAllApprovedSongs();
    }

    @GetMapping("/genre/{genre}")
    public List<SongResponse> getByGenre(@PathVariable String genre) {
        return songService.getByGenre(genre);
    }

    @GetMapping("/top")
    public List<SongResponse> getTopSongs() {
        return songService.getTopSongs();
    }

    @GetMapping("/{id}/stream")
    public ResponseEntity<Resource> streamSong(@PathVariable Long id) throws MalformedURLException {
        Song song = songService.getSongById(id);
        songService.incrementPlays(id);
        Path filePath = Paths.get(uploadDir).resolve(song.getFilePath());
        Resource resource = new UrlResource(filePath.toUri());
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("audio/mpeg"))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" + song.getFilePath() + "\"")
                .body(resource);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSong(@PathVariable Long id) throws IOException {
        songService.deleteSong(id);
        return ResponseEntity.noContent().build();
    }
}