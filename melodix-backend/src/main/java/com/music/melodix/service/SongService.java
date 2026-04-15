package com.music.melodix.service;

import com.music.melodix.dto.ReviewRequest;
import com.music.melodix.dto.SongResponse;
import com.music.melodix.model.Song;
import com.music.melodix.model.User;
import com.music.melodix.repository.SongRepository;
import com.music.melodix.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SongService {

    private final SongRepository songRepository;
    private final UserRepository userRepository;

    @Value("${melodix.upload.dir}")
    private String uploadDir;

    public SongResponse uploadSong(MultipartFile file, String title, String artist,
                                   String album, String genre, Integer duration,
                                   String email) throws IOException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (user.getRole() != User.Role.ARTIST && user.getRole() != User.Role.ADMIN) {
            throw new RuntimeException("Solo los artistas pueden subir canciones");
        }

        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) Files.createDirectories(uploadPath);

        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        Song song = new Song();
        song.setTitle(title);
        song.setArtist(artist);
        song.setAlbum(album);
        song.setGenre(genre);
        song.setDuration(duration);
        song.setFilePath(fileName);
        song.setUploadedBy(user);
        // Admin sube directo aprobado, artista queda en PENDING
        song.setStatus(user.getRole() == User.Role.ADMIN ?
                Song.SongStatus.APPROVED : Song.SongStatus.PENDING);

        return toResponse(songRepository.save(song));
    }

    public List<SongResponse> getAllApprovedSongs() {
        return songRepository.findByStatus(Song.SongStatus.APPROVED)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<SongResponse> getPendingSongs() {
        return songRepository.findByStatus(Song.SongStatus.PENDING)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<SongResponse> getMySongs(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return songRepository.findByUploadedById(user.getId())
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<SongResponse> searchByTitle(String title) {
        return songRepository.findByStatusAndTitleContainingIgnoreCase(Song.SongStatus.APPROVED, title)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<SongResponse> searchByArtist(String artist) {
        return songRepository.findByStatusAndArtistContainingIgnoreCase(Song.SongStatus.APPROVED, artist)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<SongResponse> getByGenre(String genre) {
        return songRepository.findByStatusAndGenreIgnoreCase(Song.SongStatus.APPROVED, genre)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<SongResponse> getTopSongs() {
        return songRepository.findTop10ByStatusOrderByPlaysDesc(Song.SongStatus.APPROVED)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public Song getSongById(Long id) {
        return songRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cancion no encontrada: " + id));
    }

    public SongResponse approveSong(Long id) {
        Song song = getSongById(id);
        song.setStatus(Song.SongStatus.APPROVED);
        song.setRejectionReason(null);
        return toResponse(songRepository.save(song));
    }

    public SongResponse rejectSong(Long id, ReviewRequest request) {
        Song song = getSongById(id);
        song.setStatus(Song.SongStatus.REJECTED);
        song.setRejectionReason(request.getComment());
        return toResponse(songRepository.save(song));
    }

    public void incrementPlays(Long id) {
        Song song = getSongById(id);
        song.setPlays(song.getPlays() + 1);
        songRepository.save(song);
    }

    public void deleteSong(Long id) throws IOException {
        Song song = getSongById(id);
        Path filePath = Paths.get(uploadDir).resolve(song.getFilePath());
        Files.deleteIfExists(filePath);
        songRepository.deleteById(id);
    }

    public SongResponse toResponse(Song song) {
        SongResponse response = new SongResponse();
        response.setId(song.getId());
        response.setTitle(song.getTitle());
        response.setArtist(song.getArtist());
        response.setAlbum(song.getAlbum());
        response.setGenre(song.getGenre());
        response.setDuration(song.getDuration());
        response.setCoverUrl(song.getCoverUrl());
        response.setPlays(song.getPlays());
        response.setStatus(song.getStatus().name());
        response.setRejectionReason(song.getRejectionReason());
        response.setUploadedBy(song.getUploadedBy() != null ?
                song.getUploadedBy().getUsername() : "Admin");
        response.setUploadedAt(song.getUploadedAt());
        response.setStreamUrl("/api/songs/" + song.getId() + "/stream");
        return response;
    }
}