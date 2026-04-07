package com.music.melodix.service;

import com.music.melodix.dto.SongResponse;
import com.music.melodix.model.Song;
import com.music.melodix.repository.SongRepository;
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

    @Value("${melodix.upload.dir}")
    private String uploadDir;

    public SongResponse uploadSong(MultipartFile file,
                                   String title,
                                   String artist,
                                   String album,
                                   String genre,
                                   Integer duration) throws IOException {

        // Crear carpeta si no existe
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Guardar el archivo
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Guardar en base de datos
        Song song = new Song();
        song.setTitle(title);
        song.setArtist(artist);
        song.setAlbum(album);
        song.setGenre(genre);
        song.setDuration(duration);
        song.setFilePath(fileName);

        return toResponse(songRepository.save(song));
    }

    public List<SongResponse> getAllSongs() {
        return songRepository.findAll()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<SongResponse> searchByTitle(String title) {
        return songRepository.findByTitleContainingIgnoreCase(title)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<SongResponse> searchByArtist(String artist) {
        return songRepository.findByArtistContainingIgnoreCase(artist)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<SongResponse> getByGenre(String genre) {
        return songRepository.findByGenreIgnoreCase(genre)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<SongResponse> getTopSongs() {
        return songRepository.findTop10ByOrderByPlaysDesc()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public Song getSongById(Long id) {
        return songRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Canción no encontrada: " + id));
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

    private SongResponse toResponse(Song song) {
        SongResponse response = new SongResponse();
        response.setId(song.getId());
        response.setTitle(song.getTitle());
        response.setArtist(song.getArtist());
        response.setAlbum(song.getAlbum());
        response.setGenre(song.getGenre());
        response.setDuration(song.getDuration());
        response.setCoverUrl(song.getCoverUrl());
        response.setPlays(song.getPlays());
        response.setUploadedAt(song.getUploadedAt());
        response.setStreamUrl("/api/songs/" + song.getId() + "/stream");
        return response;
    }
}
