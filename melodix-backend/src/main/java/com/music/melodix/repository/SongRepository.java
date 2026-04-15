package com.music.melodix.repository;

import com.music.melodix.model.Song;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SongRepository extends JpaRepository<Song, Long> {
    List<Song> findByStatus(Song.SongStatus status);
    List<Song> findByStatusAndTitleContainingIgnoreCase(Song.SongStatus status, String title);
    List<Song> findByStatusAndArtistContainingIgnoreCase(Song.SongStatus status, String artist);
    List<Song> findByStatusAndGenreIgnoreCase(Song.SongStatus status, String genre);
    List<Song> findTop10ByStatusOrderByPlaysDesc(Song.SongStatus status);
    List<Song> findByUploadedById(Long userId);
}